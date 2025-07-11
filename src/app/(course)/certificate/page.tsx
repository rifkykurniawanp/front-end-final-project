"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Award, Download, Printer, Share2, CheckCircle, Coffee, Leaf, Star, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function TeaCoffeeCertificate() {
  // State for certificate data
  const [certificateData, setCertificateData] = useState({
    studentName: 'Loading...',
    courseName: 'Professional Tea & Coffee Mastery',
    completionDate: '2025-07-11',
    instructorName: 'Master Elena Rodriguez',
    courseHours: '60',
    certificateId: 'TEACOFFEE-2025-001',
    grade: 'A+',
    specialization: 'Artisan Brewing & Herbal Blending',
    skills: ['Tea Blending', 'Coffee Roasting', 'Herbal Medicine', 'Flavor Profiling']
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 DATA FETCHING SECTION - REPLACE WITH YOUR API CALLS
  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Replace with your actual API endpoint
        // Example: const response = await fetch(`/api/certificates/${certificateId}`);
        // Example: const userData = await response.json();
        
        // Simulating API call - REPLACE THIS WITH YOUR ACTUAL FETCH
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // TODO: Replace this mock data with actual API response
        const mockUserData = {
          studentName: 'Sarah Chen',
          courseName: 'Professional Tea & Coffee Mastery',
          completionDate: '2025-07-11',
          instructorName: 'Master Elena Rodriguez',
          courseHours: '60',
          certificateId: 'TEACOFFEE-2025-001',
          grade: 'A+',
          specialization: 'Artisan Brewing & Herbal Blending',
          skills: ['Tea Blending', 'Coffee Roasting', 'Herbal Medicine', 'Flavor Profiling']
        };
        
        setCertificateData(mockUserData);
        setError(null);
        
      } catch (err) {
        setError('Failed to load certificate data. Please try again.');
        console.error('Certificate fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  // 🔥 USER AUTHENTICATION CHECK - ADD YOUR AUTH LOGIC HERE
  const checkUserAuthentication = () => {
    // TODO: Add your authentication check here
    // Example: const user = getCurrentUser();
    // Example: if (!user) redirect('/login');
    
    console.log('🔥 ADD YOUR AUTH CHECK HERE');
  };

  // 🔥 CERTIFICATE VALIDATION - ADD YOUR VALIDATION LOGIC
  const validateCertificate = async (certId) => {
    // TODO: Add certificate validation logic
    // Example: const isValid = await validateCertificateId(certId);
    
    console.log('🔥 ADD CERTIFICATE VALIDATION HERE:', certId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF generation
    // Example: generatePDF(certificateData);
    alert('🔥 IMPLEMENT PDF GENERATION HERE');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Tea & Coffee Mastery Certificate',
        text: `I just completed ${certificateData.courseName}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Loading Certificate...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching your achievement data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-800">Tea & Coffee Mastery</h1>
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Professional Certification in Artisan Brewing & Herbal Blending</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <Button onClick={handlePrint} className="bg-amber-600 hover:bg-amber-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Certificate
          </Button>
          <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" className="border-orange-300 hover:bg-orange-50">
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <div className="max-w-5xl mx-auto">
        <Card className="border-8 border-gradient-to-r from-amber-400 to-green-500 shadow-2xl overflow-hidden">
          <CardContent className="p-12 relative bg-gradient-to-br from-amber-25 to-green-25">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 left-8 w-24 h-24 opacity-20">
                <Coffee className="w-full h-full text-amber-600" />
              </div>
              <div className="absolute bottom-8 right-8 w-20 h-20 opacity-20">
                <Leaf className="w-full h-full text-green-600" />
              </div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 opacity-10">
                <Star className="w-full h-full text-orange-500" />
              </div>
            </div>

            {/* Certificate Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-green-500 p-4 rounded-full shadow-lg">
                    <Medal className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Certificate of Mastery</h2>
                <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-green-500 mx-auto rounded-full"></div>
              </div>

              {/* Achievement Badge */}
              <div className="flex justify-center mb-6">
                <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-lg font-semibold">
                  Grade: {certificateData.grade}
                </Badge>
              </div>

              {/* Main Content */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-6">This certifies that</p>
                
                <h3 className="text-5xl font-bold text-gray-800 mb-6 font-serif">
                  {certificateData.studentName}
                </h3>
                
                <p className="text-lg text-gray-600 mb-4">has successfully mastered the art and science of</p>
                
                <h4 className="text-2xl font-semibold text-amber-700 mb-4">
                  {certificateData.courseName}
                </h4>
                
                <p className="text-lg text-green-700 font-medium mb-6">
                  Specialization: {certificateData.specialization}
                </p>

                {/* Skills Section */}
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-3">Mastered Skills:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificateData.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-green-300 text-green-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Course Details */}
                <div className="flex justify-center items-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span className="text-sm text-gray-600">Completion Date</span>
                    </div>
                    <p className="font-semibold text-gray-700">
                      {new Date(certificateData.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Separator orientation="vertical" className="h-8" />
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Course Hours</span>
                    </div>
                    <p className="font-semibold text-gray-700">{certificateData.courseHours} Hours</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-green-50 p-6 rounded-lg border border-amber-200 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    Demonstrating exceptional knowledge in tea cultivation, coffee roasting techniques, 
                    herbal medicine principles, flavor profiling, brewing methodologies, and the cultural 
                    significance of tea and coffee traditions worldwide.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="border-t-2 border-amber-400 pt-4 mb-2 w-52">
                    <p className="font-semibold text-gray-700">{certificateData.instructorName}</p>
                    <p className="text-sm text-gray-600">Master Tea & Coffee Artisan</p>
                    <p className="text-sm text-gray-600">Certified Herbalist & Roaster</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {certificateData.certificateId}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Issued on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔥 ADMIN PANEL - FOR TESTING/CUSTOMIZATION */}
      <div className="max-w-4xl mx-auto mt-8 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Certificate Customization
              <Badge variant="outline" className="ml-2">Admin Panel</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-700">
                🔥 <strong>Developer Note:</strong> This panel is for testing. In production, 
                certificate data should be fetched from your database based on user authentication.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={certificateData.studentName}
                  onChange={(e) => setCertificateData({...certificateData, studentName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={certificateData.courseName}
                  onChange={(e) => setCertificateData({...certificateData, courseName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="completionDate">Completion Date</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={certificateData.completionDate}
                  onChange={(e) => setCertificateData({...certificateData, completionDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={certificateData.grade}
                  onChange={(e) => setCertificateData({...certificateData, grade: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="courseHours">Course Hours</Label>
                <Input
                  id="courseHours"
                  type="number"
                  value={certificateData.courseHours}
                  onChange={(e) => setCertificateData({...certificateData, courseHours: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="certificateId">Certificate ID</Label>
                <Input
                  id="certificateId"
                  value={certificateData.certificateId}
                  onChange={(e) => setCertificateData({...certificateData, certificateId: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0.5in;
          }
          
          body {
            background: white !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .bg-gradient-to-br {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}