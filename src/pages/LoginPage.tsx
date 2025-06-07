import NavBar from "../components/NavBar";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(6).max(20),
});

type loginForm = z.infer<typeof loginSchema>;

const baseURL = import.meta.env.BASE_URL;

const LoginPage = () => {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // redirect if already logged in
  useEffect(() => {
    if (isSignedIn && isAuthLoaded) {
      navigate("/app");
    }
  }, [isSignedIn, navigate, isAuthLoaded]);

  async function handleLogSubmit(formData: loginForm) {
    if (!isSignInLoaded) return;
    try {
      // 1. Log in using Clerk
      const result = await signIn?.create({
        identifier: formData.email,
        password: formData.password,
      });
      // 2. Activate the session immediately
      await setActive({ session: result?.createdSessionId });
      // 3. Call your backend to check user profile
      const response = await fetch(`${baseURL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      // 4. Navigate to dashboard
      navigate("/app");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="bg-secondary  m-6 py-6 px-12">
      <NavBar />
      <div className="h-[calc(100vh-9.25rem)] flex items-center justify-center">
        <Card className="w-100 bg-[#42484d] text-white">
          <CardHeader>Sign In with your E-mail</CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-10"
                onSubmit={form.handleSubmit(handleLogSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Sign in</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p>Don't have an account?</p>
            <Button
              asChild
              variant="link"
              size="sm"
              className="text-primary font-bold p-0"
            >
              <Link to="/signup">SIGN UP</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
