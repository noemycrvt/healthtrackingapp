import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { format, parseISO } from "date-fns";

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }

      const doses: any[] = [];
      const journals: any[] = [];

      // Get all doses from all medication groups
      const groupsRef = collection(db, "users", user.uid, "medicationGroups");
      const groupSnaps = await getDocs(groupsRef);

      for (const groupDoc of groupSnaps.docs) {
        const dosesRef = collection(db, "users", user.uid, "medicationGroups", groupDoc.id, "doses");
        const doseSnaps = await getDocs(dosesRef);
        doseSnaps.forEach((doc) => {
          const data = doc.data();
          if (data.date && data.status) {
            doses.push(data);
          }
        });
      }

      // Get all journal entries
      const journalRef = collection(db, "users", user.uid, "journalEntries");
      const journalSnaps = await getDocs(journalRef);
      journalSnaps.forEach((doc) => {
        const data = doc.data();
        if (data.date) journals.push(data);
      });

      // Build a date map
      const dateMap: Record<string, any> = {};

      // Add medication stats
      doses.forEach((dose) => {
        const date = dose.date;
        if (!dateMap[date]) dateMap[date] = { taken: 0, skipped: 0 };
        if (dose.status === "taken") dateMap[date].taken += 1;
        if (dose.status === "skipped") dateMap[date].skipped += 1;
      });

      // Add journal stats
      journals.forEach((entry) => {
        const date = format(new Date(entry.date), "yyyy-MM-dd");
        if (!dateMap[date]) dateMap[date] = {};
        const d = dateMap[date];
        d.painRatings = [...(d.painRatings || []), entry.painRating ?? 0];
        d.energyRatings = [...(d.energyRatings || []), entry.energyRating ?? 0];
        d.anxietyRatings = [...(d.anxietyRatings || []), entry.anxietyRating ?? 0];
        d.moodRatings = [...(d.moodRatings || []), entry.moodRating ?? 0];
      });

      // Turn dateMap into sorted array
      const sorted = Object.entries(dateMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, stats]) => {
          const total = (stats.taken || 0) + (stats.skipped || 0);
          const adherence = total > 0 ? Math.round((stats.taken / total) * 100) : 0;

          const avg = (arr: number[]) =>
            arr && arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

          return {
            date: format(parseISO(date), "MMM d"),
            adherence,
            pain: avg(stats.painRatings || []),
            energy: avg(stats.energyRatings || []),
            anxiety: avg(stats.anxietyRatings || []),
            mood: avg(stats.moodRatings || []),
          };
        });

      setChartData(sorted);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (title: string, data: number[], maxValue: number, yLabel = "", segments = 4) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>{title}</Text>
      <LineChart
        data={{
          labels: chartData.map((d) => d.date),
          datasets: [{ data }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix={yLabel}
        chartConfig={chartConfig}
        bezier
        fromZero
        fromNumber={maxValue}
        segments={segments}
        style={{ borderRadius: 16 }}
      />
    </View>
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 10 }}>Loading insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>Insights</Text>
      {renderChart("Medication Adherence (%)", chartData.map((d) => d.adherence), 100, "%", 5)}
      {renderChart("Pain Level (0–4)", chartData.map((d) => d.pain), 4)}
      {renderChart("Energy Level (0–4)", chartData.map((d) => d.energy), 4)}
      {renderChart("Anxiety Level (0–4)", chartData.map((d) => d.anxiety), 4)}
      {renderChart("Mood Level (0–4)", chartData.map((d) => d.mood), 4)}
    </ScrollView>
  );
}
