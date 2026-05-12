import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";

import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
  button: "#2D6CDF",
};

const lightTheme = {
  background: "#F5F5F5",
  card: "#FFFFFF",
  text: "#111111",
  subText: "#666666",
  border: "#E5E5E5",
  input: "#FFFFFF",
  button: "#2D6CDF",
};

/* ------------------------------- Notes Data ------------------------------ */

const initialNotes = [
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
];

/* -------------------------------------------------------------------------- */
/*                                   APP                                      */
/* -------------------------------------------------------------------------- */

export default function App() {
  /* ------------------------------ System Theme ----------------------------- */

  const systemScheme = useColorScheme();

  /* --------------------------- Responsive Layout --------------------------- */

  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  /* --------------------------------- States -------------------------------- */

  const [darkMode, setDarkMode] = useState(systemScheme === "dark");

  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState(initialNotes);

  const [showEditor, setShowEditor] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);

  const [noteTitle, setNoteTitle] = useState("");

  const [noteContent, setNoteContent] = useState("");

  /* --------------------------- Screen Orientation -------------------------- */

  useEffect(() => {
    async function setOrientation() {
      await ScreenOrientation.unlockAsync();
    }

    setOrientation();
  }, []);

  /* --------------------------------- Theme --------------------------------- */

  const theme = darkMode ? darkTheme : lightTheme;

  /* ----------------------------- Search Filter ----------------------------- */

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  /* ----------------------------- Save Function ----------------------------- */

  const handleSaveNote = () => {
    if (noteTitle.trim() === "" || noteContent.trim() === "") return;

    // Edit Existing Note
    if (editingNoteId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              title: noteTitle,
              content: noteContent,
            }
          : note,
      );

      setNotes(updatedNotes);
    } else {
      // Create New Note
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle,
        content: noteContent,
        date: new Date().toLocaleDateString(),
      };

      setNotes([newNote, ...notes]);
    }

    setNoteTitle("");
    setNoteContent("");
    setEditingNoteId(null);
    setShowEditor(false);
  };

  /* ---------------------------- Delete Function ---------------------------- */

  const handleDeleteNote = () => {
    const updatedNotes = notes.filter((note) => note.id !== editingNoteId);

    setNotes(updatedNotes);

    setNoteTitle("");
    setNoteContent("");
    setEditingNoteId(null);
    setShowEditor(false);
  };

  /* ----------------------------- Theme Styles ----------------------------- */

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

  const editorTitleStyle = StyleSheet.compose(styles.editorTitleInput, {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
  });

  const editorContentStyle = StyleSheet.compose(styles.editorContentInput, {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
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
      onPress={() => {
        setShowEditor(true);
        setEditingNoteId(note.id);
        setNoteTitle(note.title);
        setNoteContent(note.content);
      }}
    >
      <Text style={titleStyle}>{note.title}</Text>

      <Text numberOfLines={2} style={contentStyle}>
        {note.content}
      </Text>

      <Text style={dateStyle}>{note.date}</Text>
    </Pressable>
  );

  /* -------------------------------------------------------------------------- */
  /*                              NOTE EDITOR SCREEN                            */
  /* -------------------------------------------------------------------------- */

  if (showEditor) {
    return (
      <SafeAreaView style={containerStyle}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Background */}
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1200&auto=format&fit=crop",
              }}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.overlay}>
                <Text style={styles.editorHeading}>
                  {editingNoteId ? "Edit Note" : "Create Note"}
                </Text>

                <Text style={styles.editorSubHeading}>
                  Write your thoughts freely
                </Text>
              </View>
            </ImageBackground>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              {/* Back Button */}
              <Pressable
                onPress={() => {
                  setShowEditor(false);

                  setEditingNoteId(null);

                  setNoteTitle("");

                  setNoteContent("");
                }}
                style={({ pressed }) => [
                  styles.backButton,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  Back
                </Text>
              </Pressable>

              {/* Delete Button */}
              {editingNoteId && (
                <Pressable
                  onPress={handleDeleteNote}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    {
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={styles.saveButtonText}>Delete</Text>
                </Pressable>
              )}

              {/* Save Button */}
              <Pressable
                onPress={handleSaveNote}
                style={({ pressed }) => [
                  styles.saveButton,
                  {
                    backgroundColor: theme.button,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>

            {/* Title Input */}
            <TextInput
              placeholder="Note Title"
              placeholderTextColor={theme.subText}
              value={noteTitle}
              onChangeText={setNoteTitle}
              style={editorTitleStyle}
            />

            {/* Content Input */}
            <TextInput
              placeholder="Start writing your note..."
              placeholderTextColor={theme.subText}
              value={noteContent}
              onChangeText={setNoteContent}
              multiline
              textAlignVertical="top"
              style={editorContentStyle}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              NOTES LIST SCREEN                             */
  /* -------------------------------------------------------------------------- */

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

          <View style={styles.switchContainer}>
            <Text style={switchTextStyle}>{darkMode ? "Dark" : "Light"}</Text>

            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={theme.subText}
          value={search}
          onChangeText={setSearch}
          style={searchInputStyle}
        />

        {/* Create Note Button */}
        <Pressable
          onPress={() => {
            setShowEditor(true);
            setEditingNoteId(null);
            setNoteTitle("");
            setNoteContent("");
          }}
          style={({ pressed }) => [
            styles.createButton,
            {
              backgroundColor: theme.button,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.createButtonText}>Create New Note</Text>
        </Pressable>

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
    marginBottom: 18,
  },

  createButton: {
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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

  imageBackground: {
    height: 220,
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 24,
  },

  imageStyle: {
    borderRadius: 28,
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 24,
    borderRadius: 28,
  },

  editorHeading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  editorSubHeading: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: "500",
    color: "#F5F5F5",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 10,
  },

  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "#E53935",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  editorTitleInput: {
    height: 60,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  editorContentInput: {
    minHeight: 320,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 40,
  },
});
