import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      const repos = response.data;
      setRepositories(repos);
    });
  }, []);

  async function handleLikeRepository(id) {
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    const response = await api.post(`repositories/${id}/like`);

    const repo = response.data;

    if (response.status === 200) {
      // Request was done successfully
      const repos = [...repositories];
      // Replace the previous repo instance with the updated one
      repos.splice(repoIndex, 1, repo);
      setRepositories(repos);
    }
  }

  function renderRepo(repo) {
    return (
      <>
        <Text style={styles.repository}>{repo.title}</Text>

        <View style={styles.techsContainer}>
          {repo.techs.map(tech => {
            return <Text key={tech} style={styles.tech}>{tech}</Text>;
          })}
        </View>

        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            testID={`repository-likes-${repo.id}`}
          >
            {`${repo.likes} curtidas`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(repo.id)}
          testID={`like-button-${repo.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>
          <FlatList
            data={repositories}
            keyExtractor={repo => repo.id}
            renderItem={({ item: repo }) => renderRepo(repo)}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
