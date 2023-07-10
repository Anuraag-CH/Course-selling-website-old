import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";

function Signin() {
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
            Welcome to mywebsite. Signin below.
          </Typography>
        </div>
      </center>
      <center>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Email"
            variant="outlined"
            style={{ marginBottom: 10 }}
          />
          <br></br>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Password"
            variant="outlined"
            style={{ marginBottom: 10 }}
          />
          <br></br>
          <Button size="large" variant="contained" style={{ marginBottom: 10 }}>
            Signin
          </Button>
        </Card>
      </center>
    </div>
  );
}

export default Signin;
