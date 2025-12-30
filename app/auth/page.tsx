"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import { Input, LoadingSpinner } from "@/components/ui";
import { SIGN_IN, SIGN_UP } from "@/graphql/mutations";
import { tokenStorage, userStorage, isAuthenticated } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { LogoIcon } from "@/components/icons";

interface SignInFormValues {
  emailOrMobile: string;
  password: string;
}

interface SignUpFormValues {
  email: string;
  mobileNumber: string;
  password: string;
  passwordConfirm: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  const [signIn, { loading: signInLoading }] = useGraphQLMutation(SIGN_IN);
  const [signUp, { loading: signUpLoading }] = useGraphQLMutation(SIGN_UP);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  const handleSignIn = async (
    values: SignInFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SignInFormValues>
  ) => {
    try {
      const result = await signIn({
        variables: {
          emailOrMobile: values.emailOrMobile.toLocaleLowerCase(),
          password: values.password,
        },
      });

      // Check for GraphQL errors in response (backend validation errors)
      if (result.error) {
        const graphQLErrors = (result.error as any)?.graphQLErrors;
        if (graphQLErrors && graphQLErrors.length > 0) {
          setErrors({
            password: graphQLErrors[0].message,
          });
          return;
        }
        // Fallback to error message if no graphQLErrors
        setErrors({
          password: result.error.message || "An error occurred",
        });
        return;
      }

      const { data } = result;

      if (data?.signIn) {
        // Store tokens and user data
        tokenStorage.setTokens(
          data.signIn.accessToken,
          data.signIn.refreshToken
        );
        userStorage.setUser(data.signIn.user);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // If data is null but no errors, show generic error
        setErrors({
          password: "Invalid credentials. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = getErrorMessage(error);
      setErrors({
        password: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (
    values: SignUpFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SignUpFormValues>
  ) => {
    try {
      const result = await signUp({
        variables: {
          email: values.email.toLocaleLowerCase(),
          mobileNumber: values.mobileNumber,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        },
      });

      // Check for GraphQL errors in response (backend validation errors)
      if (result.error) {
        const graphQLErrors = (result.error as any)?.graphQLErrors;
        if (graphQLErrors && graphQLErrors.length > 0) {
          setErrors({
            passwordConfirm: graphQLErrors[0].message,
          });
          return;
        }
        // Fallback to error message if no graphQLErrors
        setErrors({
          passwordConfirm: result.error.message || "An error occurred",
        });
        return;
      }

      const { data } = result;

      // Check if data exists and signUp mutation was successful
      if (data?.signUp) {
        // Store tokens and user data
        tokenStorage.setTokens(
          data.signUp.accessToken,
          data.signUp.refreshToken
        );
        userStorage.setUser(data.signUp.user);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // If data is null or signUp is null, show generic error
        setErrors({
          passwordConfirm: "Registration failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMessage = getErrorMessage(error);
      setErrors({
        passwordConfirm: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateSignIn = (values: SignInFormValues) => {
    const errors: Partial<SignInFormValues> = {};

    if (!values.emailOrMobile) {
      errors.emailOrMobile = "Email or mobile number is required";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const validateSignUp = (values: SignUpFormValues) => {
    const errors: Partial<SignUpFormValues> = {};

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    // Mobile number validation
    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\+?[1-9]\d{9,14}$/.test(values.mobileNumber)) {
      errors.mobileNumber = "Invalid mobile number format";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!values.passwordConfirm) {
      errors.passwordConfirm = "Please confirm your password";
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <LogoIcon />
          <p className="text-lg font-semibold text-gray-600">Seller Central</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              isLogin
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
              !isLogin
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {isLogin ? (
          <Formik
            initialValues={{ emailOrMobile: "", password: "" }}
            validate={validateSignIn}
            onSubmit={handleSignIn}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className="space-y-6">
                <Input
                  label="Email or Mobile Number"
                  name="emailOrMobile"
                  type="text"
                  placeholder="Enter your email or mobile number"
                  value={values.emailOrMobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.emailOrMobile}
                  touched={touched.emailOrMobile}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  required
                  disabled={isSubmitting}
                />

                <button
                  type="submit"
                  disabled={isSubmitting || signInLoading}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting || signInLoading ? "Signing in..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              email: "",
              mobileNumber: "",
              password: "",
              passwordConfirm: "",
            }}
            validate={validateSignUp}
            onSubmit={handleSignUp}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className="space-y-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.mobileNumber}
                  touched={touched.mobileNumber}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  label="Confirm Password"
                  name="passwordConfirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={values.passwordConfirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.passwordConfirm}
                  touched={touched.passwordConfirm}
                  required
                  disabled={isSubmitting}
                />

                <button
                  type="submit"
                  disabled={isSubmitting || signUpLoading}
                  className="w-full bg-orange-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting || signUpLoading
                    ? "Creating account..."
                    : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to Viraaj&apos;s{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
