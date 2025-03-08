'use client';

import { useEffect, useRef, useState } from 'react';
import { useSigningUp } from '@/features/sign-up/api/use-sign-up';
import SignUpForm from '@/components/ui/sign-up-form';
import { Loader2 } from 'lucide-react';
import { useUser, useSignUp } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const { user,  isSignedIn } = useUser();
  const [plan, setPlan] = useState<string | null>(null);
  const router=useRouter();
  const [isLoading,setLoading] = useState(false);

  const {setActive,isLoaded,signUp} = useSignUp();
  const signUpMutation = useSigningUp();
  const { mutate, isError, error } = signUpMutation;

  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track if email is verified
  const verificationCodeRef = useRef("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');

    if (selectedPlan) {
      setPlan(selectedPlan);
      localStorage.setItem('selectedPlan', selectedPlan);
    } else {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        setPlan(storedPlan);
      }
    }
  }, []);

  const planDetails = {
    free: { name: 'Free Plan', price: '₹0/month' },
    premium: { name: 'Premium Plan', price: '₹1000/month' },
    enterprise: { name: 'Enterprise Plan', price: '₹3000/month' },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails];
  console.log("selected plaN:", selectedPlan);

  if (!selectedPlan) {
    return <div>Invalid plan selection.</div>;
  }

  const handleSignUp = async (formData: { username: string; email: string; password: string; plan: string }) => {
  

    if (!isLoaded) return;
    try {
      if (formData.email && formData.password && formData.username) {
      console.log("Starting Clerk sign-up");
      
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        username: formData.username,
      });      
      console.log("Email otp in process");
      await signUp.prepareEmailAddressVerification({
        strategy:"email_code",
    })
    setIsVerifying(true);
  } else {
    return toast("Error", {
      description: "No fields can be empty",
})
  }    
   
    } catch (error) {
      console.error("Sign up failed:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleVerifyCode = async (formData: { username: string; email: string; password: string; plan: string }) => {
    if (!isLoaded) return
    console.log("attempting code verification with code",code);
    try {      
      const code = verificationCodeRef.current.trim();
      if (code) {       
      setLoading(true);
      console.log("The code is",code);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code,
      });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        const startDate = new Date().toISOString();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const endDateStr = endDate.toISOString();

       //  User creation mutation
        mutate({        
        email: formData.email,
        password: formData.password,
        plan: selectedPlan.name,
        startDate,
        endDate: endDateStr,
        });
        console.log("Email verified successfully.");
        router.push("/upgrade")
        // After successful verification, mark as verified
        setIsVerified(true);
        setIsVerifying(false); // Reset verification state    
        console.log("User signed up and verified.");
      } 
      } else {
        console.error("Verification code is required.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
    }

  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-muted-foreground">
            Sign Up for {selectedPlan.name}
          </h1>
          <p className="text-base text-gray-500">
            You're signing up for the {selectedPlan.name} ({selectedPlan.price}).
          </p>
        </div>

        <div className="flex items-center justify-center mt-8">
          <SignUpForm
            handleSignUp={handleSignUp}
            isLoading={isLoading}
            isError={isError}
            error={error?.message || ''}
            isVerifying={isVerifying}
            setVerificationCode={(code: string) => { verificationCodeRef.current = code; }}          
            handleVerifyCode={handleVerifyCode}
            isVerified={isVerified} // Show the verification status
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
