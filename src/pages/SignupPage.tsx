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
import NavBar from "@/components/NavBar";
import { useAuth, useSignUp } from "@clerk/clerk-react";
import { useEffect } from "react";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(6).max(20),
});

type signupForm = z.infer<typeof signupSchema>;

const baseURL = import.meta.env.BASE_URL;

const SignupPage = () => {
  const { isSignedIn, isLoaded: isAuthLoaded, userId } = useAuth();
  const { signUp, setActive, isLoaded: isSignUpLoaded } = useSignUp();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      // default value make the uncontrolled input to controlled so no need to use usestate hook
      name: "",
      email: "",
      password: "",
    },
  });

  // redirect if already signed up
  useEffect(() => {
    if (isSignedIn && isAuthLoaded) {
      navigate("/app");
    }
  }, [isSignedIn, navigate, isAuthLoaded]);

  async function handleLogSubmit(formData: signupForm) {
    if (!isSignUpLoaded) return;
    try {
      // 1. Sign up using Clerk
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        username: formData.name,
      });
      // 2. Activate the session immediately
      await setActive({ session: result.createdSessionId });
      // 3. Call your backend to store user profile
      const response = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });
      await response.json();

      // 4. Navigate to dashboard
      navigate("/app");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className="bg-secondary  m-6 py-6 px-12">
      <NavBar />
      <div className="h-[calc(100vh-9.25rem)] flex items-center justify-center">
        <Card className="w-100 bg-[#42484d] text-white">
          <CardHeader>Sign up with your E-mail</CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-10"
                onSubmit={form.handleSubmit(handleLogSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: John Smith"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit">Sign up</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p>Already have an account?</p>
            <Button
              asChild
              variant="link"
              size="sm"
              className="text-primary font-bold p-0"
            >
              <Link to="/login">LOG IN</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
