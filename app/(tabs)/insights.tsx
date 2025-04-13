import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { format, subDays, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [medicationData, setMedicationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMedicationData();
  }, []);
  
  const fetchMedicationData = async () => {
    try {
      setIsLoading(true);
      
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        setIsLoading(false);
        return;
      }
      
      // Get the last 7 days of data
      const endDate = new Date();
      const startDate = subDays(endDate, 6); // 7 days including today
      
      const dateRange = [];
      for (let i = 0; i < 7; i++) {
        const date = subDays(endDate, i);
        dateRange.unshift(format(date, "yyyy-MM-dd"));
      }
      
      // Fetch all medications for the user within the date range
      const medsRef = collection(db, "users", user.uid, "medications");
      const querySnapshot = await getDocs(medsRef);
      
      const allMedications = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id,
          name: data.name,
          time: data.time,
          date: data.date,
          status: data.status || "pending",
          /*status: "taken" pretend everything is taken for test */
        };
      });
      
      // Process data by day
      const processedData = dateRange.map(date => {
        const dayMeds = allMedications.filter(med => med.date === date);
        
        return {
          date: format(parseISO(date), "MMM d"),
          medsTaken: dayMeds.filter(med => med.status === "taken").length,
          medsPrescribed: dayMeds.length,
          // Set default values for other metrics (you can replace these with actual data when available)
          painLevel: Math.floor(Math.random() * 5),
          energyLevel: Math.floor(Math.random() * 5),
          anxietyLevel: Math.floor(Math.random() * 5),
          moodLevel: Math.floor(Math.random() * 5)
        };
      });
      
      setMedicationData(processedData);
    } catch (error) {
      console.error("Error fetching medication data:", error);
      // Fall back to sample data if there's an error
      setMedicationData(sampleLogs);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use sample data until Firebase data loads
  const dataToUse = medicationData.length > 0 ? medicationData : sampleLogs;
  
  // Process data for charts
  const labels = dataToUse.map(log => log.date);
  const adherenceData = dataToUse.map(log => 
    log.medsPrescribed > 0 ? Math.round((log.medsTaken / log.medsPrescribed) * 100) : 0
  );
  const painData = dataToUse.map(log => log.painLevel);
  const energyData = dataToUse.map(log => log.energyLevel);
  const anxietyData = dataToUse.map(log => log.anxietyLevel);
  const moodData = dataToUse.map(log => log.moodLevel);
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
  };
  
  const renderChart = (title, data, yLabel, segments) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>{title}</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix={yLabel}
        chartConfig={chartConfig}
        bezier
        fromZero
        yAxisInterval={1}
        segments={segments}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 10 }}>Loading insights...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Insights</Text>
      {renderChart("Medication Adherence (%)", adherenceData, "%", 5)}
      {renderChart("Pain Level (0–4)", painData, "", 4)}
      {renderChart("Energy Level (0–4)", energyData, "", 4)}
      {renderChart("Anxiety Level (0–4)", anxietyData, "", 4)}
      {renderChart("Mood Level (0–4)", moodData, "", 4)}
    </ScrollView>
  );
}

// Sample data to use when Firebase data is not available
const sampleLogs = [
  {
    date: "Apr 6",
    medsTaken: 3,
    medsPrescribed: 4,
    painLevel: 2,
    energyLevel: 3,
    anxietyLevel: 2,
    moodLevel: 3,
  },
  {
    date: "Apr 7",
    medsTaken: 2,
    medsPrescribed: 4,
    painLevel: 3,
    energyLevel: 2,
    anxietyLevel: 3,
    moodLevel: 1,
  },
  {
    date: "Apr 8",
    medsTaken: 4,
    medsPrescribed: 4,
    painLevel: 1,
    energyLevel: 4,
    anxietyLevel: 1,
    moodLevel: 4,
  },
  {
    date: "Apr 9",
    medsTaken: 4,
    medsPrescribed: 4,
    painLevel: 0,
    energyLevel: 3,
    anxietyLevel: 1,
    moodLevel: 4,
  },
  {
    date: "Apr 10",
    medsTaken: 3,
    medsPrescribed: 4,
    painLevel: 2,
    energyLevel: 3,
    anxietyLevel: 2,
    moodLevel: 2,
  },
];