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
      
      const endDate = new Date();
      const startDate = subDays(endDate, 6);
      
      const dateRange = [];
      for (let i = 0; i < 7; i++) {
        const date = subDays(endDate, i);
        dateRange.unshift(format(date, "yyyy-MM-dd"));
      }
      
      const medsRef = collection(db, "users", user.uid, "medications");
      const querySnapshot = await getDocs(medsRef);
      
      const allMedications = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id,
          name: data.name,
          time: data.time,
          date: data.date,
          status: data.status || "Pending",
        };
      });

        // Fetch Journal Entries 
    const journalRef = collection(db, "users", user.uid, "journalEntries");
    const journalSnapshot = await getDocs(journalRef);
    const allJournals = journalSnapshot.docs.map(doc => doc.data());
  
    const processedData = dateRange.map(dateStr => {
    const displayDate = format(parseISO(dateStr), "MMM d");

      // Medication data
      const medsForDay = allMedications.filter(med => med.date === dateStr);
      const medsTaken = medsForDay.filter(med => med.status === "taken").length;
      const medsPrescribed = medsForDay.length;


      // Journal data
      const journalsForDay = allJournals.filter(entry => {
      const entryDate = new Date(entry.date); 
      return format(entryDate, "yyyy-MM-dd") === dateStr;
    });
  
      
      const avg = (values) =>
        values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      
      return {
        date: displayDate,
        medsTaken,
        medsPrescribed,
        painLevel: avg(journalsForDay.map(j => j.painRating ?? 0)),
        energyLevel: avg(journalsForDay.map(j => j.energyRating ?? 0)),
        anxietyLevel: avg(journalsForDay.map(j => j.anxietyRating ?? 0)), 
        moodLevel: avg(journalsForDay.map(j => j.moodRating ?? 0)),
        };
    });

    setMedicationData(processedData);
    } catch (error) {
    console.error("Error fetching data:", error);
    } finally {
    setIsLoading(false);
    }
};

 const dataToUse = medicationData;

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