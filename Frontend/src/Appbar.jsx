import { Button, Typography } from "@mui/material";

function Appbar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <Typography>Website</Typography>
      </div>
      <div>
        <Button
          onClick={() => {
            window.location = "/signup";
          }}
        >
          Signup
        </Button>
        <Button
          onClick={() => {
            window.location = "/signin";
          }}
        >
          Signin
        </Button>
      </div>
    </div>
  );
}
export default Appbar;
