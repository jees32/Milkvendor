'use client'; // Add this line to ensure this component is rendered on the client side

import React from 'react';
import { Users, CreditCard, BarChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk

const SaasFeatures = () => {
  const { user, isSignedIn } = useUser(); // Use Clerk's useUser hook to get user data
  const router = useRouter(); // For routing

  // Redirect to dashboard if the user is signed in
  const handleSignUpRedirect = (plan: string) => {
    if (isSignedIn) {
      router.push('/dashboard'); // If the user is signed in, redirect them to the dashboard
    } else {
      router.push(`/sign-up?plan=${plan}`); // Otherwise, proceed to sign-up page
    }
  };

  return (
    <section className="py-16 bg-gray-100 -mt-28">
      <div className="max-w-screen-lg mx-auto text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">
          Key Features of Our Platform
        </h2>
        <p className="text-md text-gray-500 mb-10">
          Our platform empowers vendors of milk and grocery items to efficiently manage their retailer relationships. With our user-friendly dashboard, you can easily add retailer accounts, track transactions, and gain valuable insights into your business. From monitoring total sales to identifying top debtors and outstanding amounts, our solution helps you stay organized and in control, so you can focus on growing your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Manage Retailer Accounts</h3>
            <p className="text-center text-gray-600 mt-2">
              Easily add and manage retailer accounts to track transactions efficiently.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <CreditCard className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Track Transactions</h3>
            <p className="text-center text-gray-600 mt-2">
              Monitor every transaction, ensuring accurate records for your business.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <BarChart className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Business Insights</h3>
            <p className="text-center text-gray-600 mt-2">
              Gain valuable insights into your sales, top debtors, and outstanding amounts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <FileText className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Comprehensive Reports</h3>
            <p className="text-center text-gray-600 mt-2">
              Generate detailed reports to keep track of your business performance.
            </p>
          </div>
        </div>

        {/* Pricing Plans Section */}
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Free Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">0/month</p>
            <p className="text-gray-600 mt-4">- 20 Retailer Accounts</p>
            <p className="text-gray-600">- Basic Transaction Tracking</p>
            <p className="text-gray-600">- Limited Insights and Reports</p>
            <Button
              type="button"
              className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl"
              onClick={() => handleSignUpRedirect('free')}
            >
              Sign Up
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Premium Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">₹1000/month</p>
            <p className="text-gray-600 mt-4">- 2000 Retailer Accounts</p>
            <p className="text-gray-600">- Advanced Transaction Tracking</p>
            <p className="text-gray-600">- Detailed Business Insights</p>
            <Button
              type="button"
              className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl"
              onClick={() => handleSignUpRedirect('premium')}
            >
              Sign Up
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Enterprise Plan</h3>
            <p className="text-xl font-semibold text-gray-700 mt-2">₹3000/month</p>
            <p className="text-gray-600 mt-4">- Unlimited Retailer Accounts</p>
            <p className="text-gray-600">- Full Customization and Reports</p>
            <p className="text-gray-600">- Priority Support</p>
            <Button
              type="button"
              className="mt-6 w-full bg-black text-white hover:bg-gray-800 rounded-xl"
              onClick={() => handleSignUpRedirect('enterprise')}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700">Already have an account?</p>
          <Button className="mt-4 bg-gray-800 text-white rounded-xl">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SaasFeatures;
