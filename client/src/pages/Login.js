// Import the Button component
import { Button } from "../components/ui/button";

function LoginPage() {
  const handleLogin = () => {
    // Logic for handling login
    console.log("Login button clicked!");
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        {/* Your form inputs here */}
        <Button onClick={handleLogin}>Log in</Button>
      </form>
    </div>
  );
}

export default LoginPage;
