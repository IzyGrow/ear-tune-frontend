import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTest } from '@/context/TestContext';
import { ContactForm as ContactFormType } from '@/types/hearing-test';
import { ArrowLeft, Send, Shield, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactForm: React.FC = () => {
  const { testResult, setContactForm, setCurrentStep } = useTest();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ContactFormType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    kvkkConsent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormType, string>>>({});

  if (!testResult) {
    setCurrentStep(0);
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormType, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'E-posta veya telefon gereklidir';
      newErrors.phone = 'E-posta veya telefon gereklidir';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (formData.phone.trim() && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    if (!formData.kvkkConsent) {
      newErrors.kvkkConsent = 'KVKK onayı gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setContactForm(formData);
      
      // Show success message
      toast({
        title: "Başarıyla Gönderildi!",
        description: "Rapor talebiniz alındı. En kısa sürede size ulaşacağız.",
      });

      // In a real app, this would send data to backend
      console.log('Contact form submitted:', formData);
      console.log('Test result:', testResult);
      
      // For now, just show completion message
      setTimeout(() => {
        toast({
          title: "Test Tamamlandı",
          description: "İşitme testiniz başarıyla tamamlandı. Teşekkür ederiz!",
        });
      }, 1500);
    }
  };

  const handleInputChange = (field: keyof ContactFormType, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="audio-visualizer w-20 h-20 flex items-center justify-center">
              <Send className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            İletişim Bilgileri
          </h1>
          <p className="text-muted-foreground">
            Size kişiselleştirilmiş rapor gönderebilmemiz için 
            iletişim bilgilerinizi paylaşın.
          </p>
        </div>

        {/* Form Card */}
        <Card className="hearing-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Ad *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Adınız"
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Soyad *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Soyadınız"
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-posta *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ornek@email.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0555 123 45 67"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              * E-posta veya telefon numarasından en az birini girmeniz gerekmektedir.
            </div>

            {/* KVKK Consent */}
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">KVKV Aydınlatma Metni</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Kişisel verileriniz, size rapor gönderebilmek ve iletişim kurabilmek 
                      amacıyla işlenecektir. Verileriniz üçüncü taraflarla paylaşılmayacak 
                      ve sadece belirtilen amaçlar doğrultusunda kullanılacaktır. 
                      İstediğiniz zaman verilerinizin silinmesini talep edebilirsiniz.
                    </p>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="kvkkConsent"
                        checked={formData.kvkkConsent}
                        onCheckedChange={(checked) => 
                          handleInputChange('kvkkConsent', checked as boolean)
                        }
                        className={errors.kvkkConsent ? 'border-destructive' : ''}
                      />
                      <Label 
                        htmlFor="kvkkConsent" 
                        className="text-xs leading-relaxed cursor-pointer"
                      >
                        Kişisel verilerimin yukarıda belirtilen amaçlar doğrultusunda 
                        işlenmesini kabul ediyorum. *
                      </Label>
                    </div>
                    
                    {errors.kvkkConsent && (
                      <p className="text-xs text-destructive">{errors.kvkkConsent}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full hearing-button-primary text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.kvkkConsent}
            >
              <Send className="w-5 h-5 mr-2" />
              Rapor Talebimi Gönder
            </button>
          </form>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Tüm alanları doldurup KVKV onayını verin
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;