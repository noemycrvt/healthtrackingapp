import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f4f5',
    paddingTop: 100,
    padding: 10,
  },
  
formCard: {
    width: '70%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  
  label: {
    marginBottom: 0,
    fontSize: 16,
    fontWeight: '500',
    // Left-align the label
    alignSelf: 'flex-start', 
  },

  input: {
    // Full width of formCard
    width: '100%', 
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    padding: 9,
    paddingVertical: 9,
    paddingHorizontal: 10,
    paddingRight: 60,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  
  inputWithToggle: {
    // Makes room for the toggle button
    paddingRight: 60, 
  },

  passwordWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 5,
  },

  toggleButton: {
    position: 'absolute',
    right: 9,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  toggleText: {
    color: '#484848',
    fontWeight: '500',
  },

  button: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#6699FF', 
    alignItems: 'center',
    marginTop: 7,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  link: {
    marginTop: 10,
    textAlign: 'center',
    color: '#484848',
  },
});

