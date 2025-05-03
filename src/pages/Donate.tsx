
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { IndianRupee, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const Donate = () => {
  const donationAccounts = [
    { name: "Pampana Parvathi", number: "6300981252" },
    { name: "Yashoda", number: "9392811632" },
    { name: "Rajesh", number: "6302118329" },
    { name: "Uma Maheshwara Rao", number: "8309152657" }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Support Our Cause</h1>
            <div className="flex justify-center mb-6">
              <IndianRupee size={36} className="text-movie-primary" />
            </div>
            <p className="text-white/80 mb-4">
              Every contribution makes a difference. Your generous donation will help support those in need.
            </p>
            <p className="text-white/80 mb-8">
              All funds collected will be directly used to help the poor and needy. Please tag us when donating so we can acknowledge your support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {donationAccounts.map((account, index) => (
              <Card key={index} className="bg-movie-dark border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone size={18} className="text-movie-primary" />
                    {account.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 bg-movie-primary/10 py-3 rounded-md">
                    <span className="text-xl font-mono text-movie-primary">{account.number}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-white/60">PhonePe Number</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-movie-dark/50 p-6 rounded-lg border border-movie-primary/20 mb-10">
            <h2 className="text-xl font-semibold mb-4">Why Your Support Matters</h2>
            <p className="text-white/80 mb-4">
              Your donation helps us continue our mission to support those in need. Every rupee counts and goes directly to helping those who need it most.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex items-center">
                <IndianRupee className="text-movie-primary mr-2" size={24} />
                <span className="text-lg font-semibold">Make a difference today</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-white/60">
              Thank you for your generosity and support!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donate;
