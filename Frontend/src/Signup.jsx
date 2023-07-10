import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    const formData = {
      username: email,
      password: password,
    };

    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        // Handle the response from the server
        if (response.ok) {
          response.json().then((data) => {
            // Handle the successful signup
            localStorage.setItem("token", data.token); // You can perform any required actions with the response data
          });
        } else {
          // Signup failed, handle error or show error message
          console.error("Signup failed");
        }
      })
      .catch((error) => {
        // Handle any errors occurred during the fetch request
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <center>
        <div
          style={{
            paddingTop: 200,
            marginBottom: 10,
          }}
        >
          <Typography variant="h6">
            Welcome to mywebsite. Signup below.
          </Typography>
        </div>
      </center>
      <center>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            style={{ marginBottom: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <TextField
            fullWidth
            id="password"
            label="Password"
            variant="outlined"
            style={{ marginBottom: 10 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button
            size="large"
            variant="contained"
            style={{ marginBottom: 10 }}
            onClick={handleSignUp}
          >
            SignUp
          </Button>
        </Card>
      </center>
    </div>
  );
}

export default Signup;
