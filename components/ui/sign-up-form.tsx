'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface SignUpFormProps {
  handleSignUp: (formData: {
    username: string;
    email: string;
    password: string;
    plan: string;
  }) => void;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isVerifying: boolean;
  setVerificationCode: (code: string) => void;
  handleVerifyCode: (formData: {
    username: string;
    email: string;
    password: string;
    plan: string;
  }) => void;
  isVerified: boolean;
}

const SignUpForm = ({
  handleSignUp,
  isLoading,
  isError,
  error,
  isVerifying,
  setVerificationCode,
  handleVerifyCode,
  isVerified,
}: SignUpFormProps) => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [verificationCode, setLocalVerificationCode] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //Call handleSignUp with form data
 

  
    handleSignUp({
      username,
      email,
      password,
      plan    
    });
  };


  const handleVerificationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (verificationCode.trim()){
    setVerificationCode(verificationCode); 
    handleVerifyCode({
      username,
      email,
      password,
      plan    
    });// Update the verification code    
  } else {
    console.error("Verification code is required.");
  }  
  };
 

  return (
    <form onSubmit={isVerifying ? handleVerificationSubmit : handleSubmit} className="space-y-4">
      {!isVerifying ? (
        <>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
          <input
            
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setLocalVerificationCode(e.target.value)}
            required
            className="input-field"
          />
        </div>
      )}

      <button type="submit"  className="btn-primary"  disabled={isLoading || isVerified }>
        {isVerifying ? 'Verify Code' : isLoading ? 'Signing Up...' : 'Sign Up Now'}
      </button>

      {isError && <p className="text-red-500">{error}</p>}
      {isVerified && <p className="text-green-500">Your email has been verified successfully!</p>}
    </form>
  );
};


export default SignUpForm;
