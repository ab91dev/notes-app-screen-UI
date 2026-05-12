import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

/* ----------------------------- Theme Objects ----------------------------- */

const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  subText: "#B0B0B0",
  border: "#2A2A2A",
  input: "#1A1A1A",
};

const lightTheme = {
  background: "#F5F5F5",
  card: "#FFFFFF",
  text: "#111111",
  subText: "#666666",
  border: "#E5E5E5",
  input: "#FFFFFF",
};

/* ------------------------------- Notes Data ------------------------------ */

const notes = [
  {
    id: "1",
    title: "Meeting Notes",
    content:
      "Discuss project roadmap, deadlines, and assign new tasks to the team.",
    date: "12 May 2026",
  },
  {
    id: "2",
    title: "Shopping List",
    content: "Buy milk, bread, coffee, eggs, and fruits for the upcoming week.",
    date: "10 May 2026",
  },
  {
    id: "3",
    title: "React Native Ideas",
    content: "Build a weather app, expense tracker, and a notes application.",
    date: "08 May 2026",
  },
  {
    id: "4",
    title: "Workout Plan",
    content:
      "Morning cardio, evening strength training, and proper stretching.",
    date: "06 May 2026",
  },
  {
    id: "5",
    title: "Books to Read",
    content:
      "Atomic Habits, Deep Work, The Psychology of Money, and Clean Code.",
    date: "02 May 2026",
  },
  {
    id: "6",
    title: "Daily Goals",
    content:
      "Complete React Native assignment and practice responsive layouts.",
    date: "01 May 2026",
  },
];

export default function App() {
  /* ------------------------------ System Theme ----------------------------- */

  const systemScheme = useColorScheme();

  /* --------------------------- Responsive Layout --------------------------- */

  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  /* --------------------------------- States -------------------------------- */

  const [darkMode, setDarkMode] = useState(systemScheme === "dark");

  const [search, setSearch] = useState("");

  /* --------------------------- Screen Orientation -------------------------- */

  useEffect(() => {
    async function setOrientation() {
      await ScreenOrientation.unlockAsync();
    }

    setOrientation();
  }, []);

  /* ----------------------------- Search Filter ----------------------------- */

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  /* --------------------------------- Theme --------------------------------- */

  const theme = darkMode ? darkTheme : lightTheme;

  /* ----------------------- StyleSheet.compose Styles ----------------------- */

  const containerStyle = StyleSheet.compose(styles.container, {
    backgroundColor: theme.background,
    paddingHorizontal: isTablet ? 30 : 20,
  });

  const headingStyle = StyleSheet.compose(styles.heading, {
    color: theme.text,
  });

  const subHeadingStyle = StyleSheet.compose(styles.subHeading, {
    color: theme.subText,
  });

  const switchTextStyle = StyleSheet.compose(styles.switchText, {
    color: theme.text,
  });

  const searchInputStyle = StyleSheet.compose(styles.searchInput, {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
  });

  const cardStyle = StyleSheet.compose(styles.card, {
    backgroundColor: theme.card,
    borderColor: theme.border,
    width: isTablet ? "48%" : "100%",
  });

  const titleStyle = StyleSheet.compose(styles.title, {
    color: theme.text,
  });

  const contentStyle = StyleSheet.compose(styles.content, {
    color: theme.subText,
  });

  const dateStyle = StyleSheet.compose(styles.date, {
    color: theme.subText,
  });

  /* ------------------------------ Render Notes ----------------------------- */

  const renderItem = ({ item: note }) => (
    <Pressable
      style={({ pressed }) => [
        cardStyle,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={titleStyle}>{note.title}</Text>

      <Text numberOfLines={2} style={contentStyle}>
        {note.content}
      </Text>

      <Text style={dateStyle}>{note.date}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={headingStyle}>My Notes</Text>

            <Text style={subHeadingStyle}>Organize your thoughts</Text>
          </View>

          {/* Theme Toggle */}
          <View style={styles.switchContainer}>
            <Text style={switchTextStyle}>{darkMode ? "Dark" : "Light"}</Text>

            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Search Input */}
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={theme.subText}
          value={search}
          onChangeText={setSearch}
          style={searchInputStyle}
        />

        {/* Notes List */}
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          numColumns={isTablet ? 2 : 1}
          columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.subText,
                },
              ]}
            >
              No notes found
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: "700",
  },

  subHeading: {
    fontSize: 15,
    marginTop: 4,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  switchText: {
    marginRight: 8,
    fontWeight: "600",
    fontSize: 14,
  },

  searchInput: {
    height: 55,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 22,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },

  date: {
    fontSize: 13,
    fontWeight: "500",
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  listContainer: {
    paddingBottom: 20,
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    fontWeight: "500",
  },
});
