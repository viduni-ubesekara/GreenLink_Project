import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Grid, Paper, Box, Divider } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function PromotionDashboard() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/userpromo/getpromotions");
        const data = response.data.map((promo) => ({
          ...promo,
          startDateObj: new Date(promo.startDate),
          endDateObj: new Date(promo.endDate),
        }));
        setPromotions(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch promotions", error);
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const filteredPromotions = promotions.filter((promo) => {
    if (activeFilter === "All") return true;
    const now = new Date();
    if (activeFilter === "Active") return new Date(promo.endDate) > now;
    if (activeFilter === "Expired") return new Date(promo.endDate) <= now;
    return true;
  });

  const typeData = [
    { name: "Individual", value: filteredPromotions.filter((p) => p.promotionType === "Individual").length },
    { name: "Group", value: filteredPromotions.filter((p) => p.promotionType === "Group").length }, // Changed to Group
  ];

  const statusData = [
    { name: "Active", value: filteredPromotions.filter((p) => new Date(p.endDate) > new Date()).length },
    { name: "Expired", value: filteredPromotions.filter((p) => new Date(p.endDate) <= new Date()).length },
  ];

  const durationData = filteredPromotions.map((p) => {
    const duration = Math.round((p.endDateObj - p.startDateObj) / (1000 * 60 * 60 * 24));
    return {
      name: p.promotionName,
      value: duration > 0 ? duration : 0,
    };
  });

  const longest = Math.max(...durationData.map((d) => d.value), 0);
  const shortest = Math.min(...durationData.map((d) => d.value), longest);

  const weeklyDistribution = filteredPromotions.reduce((acc, promo) => {
    const week = `Week ${Math.ceil(new Date(promo.startDate).getDate() / 7)}`;
    const existing = acc.find((item) => item.name === week);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: week, count: 1 });
    }
    return acc;
  }, []);

  const monthlyData = filteredPromotions.reduce((acc, p) => {
    const date = new Date(p.startDate);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const existing = acc.find((item) => item.key === monthYear);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ key: monthYear, name: date.toLocaleString("default", { month: "short", year: "numeric" }), count: 1 });
    }
    return acc.sort((a, b) => new Date(`${a.key}-01`) - new Date(`${b.key}-01`));
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6">Loading promotion data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom textAlign="center" color="green">
        📊Promotion Analytics Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3, gap: 2 }}>
        {['All', 'Active', 'Expired'].map((filter) => (
          <Paper
            key={filter}
            onClick={() => setActiveFilter(filter)}
            elevation={3}
            sx={{ cursor: "pointer", px: 3, py: 1, backgroundColor: activeFilter === filter ? "#c8e6c9" : "white" }}
          >
            <Typography>{filter}</Typography>
          </Paper>
        ))}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ borderRadius: 4, p: 2, backgroundColor: "#ffffff" }}>
            <Typography variant="h6" gutterBottom>
              ✅ Promotion Status Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ borderRadius: 4, p: 2, backgroundColor: "#ffffff" }}>
            <Typography variant="h6" gutterBottom>
              📁 Promotion Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {typeData.map((_, index) => (
                    <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ borderRadius: 4, p: 2, backgroundColor: "#ffffff" }}>
            <Typography variant="h6" gutterBottom>
              📅 Weekly Promotion Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ borderRadius: 4, p: 2, backgroundColor: "#ffffff" }}>
            <Typography variant="h6" gutterBottom>
              📆 Monthly Promotion Trend
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 4, backgroundColor: "#e8f5e9" }}>
            <Typography variant="h6" color="green">
              📌 Summary
            </Typography>
            <Typography variant="body1">
              A total of <strong>{filteredPromotions.length}</strong> promotions have been launched. Of these, <strong>{typeData[0].value}</strong> were targeted to individuals while <strong>{typeData[1].value}</strong> were group promotions accessible to all users.
            </Typography>
            <Typography variant="body1">
              Promotion durations ranged from <strong>{shortest}</strong> days to a maximum of <strong>{longest}</strong> days, indicating a diverse range of campaign lengths tailored to different marketing strategies.
            </Typography>
            <Typography variant="body1">
              Current promotion status reveals <strong>{statusData[0].value}</strong> active campaigns and <strong>{statusData[1].value}</strong> expired ones. Monitoring this helps identify periods of user engagement.
            </Typography>
            <Typography variant="body1">
              Weekly and monthly charts highlight promotional intensity. These trends can be useful to align campaigns with user behavior.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
