import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  CardHeader,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
} from "@material-ui/core";

const STORAGE_KEY = "userDatabase";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEY);
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          const response = await axios.get(
            "https://randomuser.me/api/?results=50"
          );
          const { results } = response.data;
          setUsers(results);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://randomuser.me/api/?results=50");
      const { results } = response.data;
      setUsers(results);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Button onClick={handleRefresh} variant="contained">
            Refresh
          </Button>
          <div style={{ margin: "20px 0", fontSize: "20px" }}>
            Total items: {users.length}
          </div>
          {users.map((user) => (
            <Card
              key={user.id}
              sx={{
                maxWidth: 245,
                border: "10px solid #0000",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 1)",
                marginBottom: "20px",
              }}
            >
              <CardHeader avatar={<Avatar src={user.picture.thumbnail} />} />

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {`${user.name.first} ${user.name.last}`}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Button
                  onClick={() => handleDelete(user.id)}
                  variant="contained"
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
