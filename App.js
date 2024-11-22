import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const questions = [
  { id: 1, question: 'What is your name?', placeholder: 'Enter your name' },
  { id: 2, question: 'What is your age?', placeholder: 'Enter your age' },
  { id: 3, question: 'What is your favorite color?', placeholder: 'Enter your favorite color' },
];

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to the Survey!</Text>
    <Button title="Start Survey" onPress={() => navigation.navigate('QuestionScreen')} />
  </View>
);

const QuestionScreen = ({ navigation, route }) => {
  const { currentQuestionIndex, answers, setAnswers } = route.params;
  const question = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      navigation.push('QuestionScreen', {
        currentQuestionIndex: currentQuestionIndex + 1,
        answers,
        setAnswers,
      });
    } else {
      navigation.navigate('SummaryScreen', { answers });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>
      <TextInput
        style={styles.input}
        placeholder={question.placeholder}
        value={answers[question.id] || ''}
        onChangeText={(text) => {
          const updatedAnswers = { ...answers, [question.id]: text };
          setAnswers(updatedAnswers); // Використовуємо функцію для оновлення стану
        }}
      />
      <Button title={currentQuestionIndex + 1 < questions.length ? 'Next' : 'Finish'} onPress={handleNext} />
    </View>
  );
};


const SummaryScreen = ({ route }) => {
  const { answers } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary of Your Answers:</Text>
      {questions.map((q) => (
        <Text key={q.id} style={styles.summary}>
          {q.question}: {answers[q.id] || 'No answer'}
        </Text>
      ))}
    </View>
  );
};

const SurveyStack = ({ answers, setAnswers }) => (
  <Stack.Navigator>
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ title: 'Welcome' }} />
    <Stack.Screen
      name="QuestionScreen"
      component={QuestionScreen}
      initialParams={{ currentQuestionIndex: 0, answers, setAnswers }}
      options={{ title: 'Question' }}
    />
    <Stack.Screen name="SummaryScreen" component={SummaryScreen} options={{ title: 'Summary' }} />
  </Stack.Navigator>
);


const App = () => {
  const [answers, setAnswers] = useState({});
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeTab') {
              iconName = 'home';
            } else if (route.name === 'FormTab') {
              iconName = 'clipboard';
            } else if (route.name === 'SummaryTab') {
              iconName = 'stats-chart';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="HomeTab" options={{ title: 'Home' }}>
          {() => <SurveyStack answers={answers} setAnswers={setAnswers} />}
        </Tab.Screen>
        <Tab.Screen name="FormTab" options={{ title: 'Form' }}>
          {() => <SurveyStack answers={answers} setAnswers={setAnswers} />}
        </Tab.Screen>
        <Tab.Screen name="SummaryTab" options={{ title: 'Summary' }}>
          {() => <SummaryScreen route={{ params: { answers } }} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  summary: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default App;
