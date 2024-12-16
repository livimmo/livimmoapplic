import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { SocialConnect } from "@/components/profile/SocialConnect";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { UserRole } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const Signup = () => {
  const [step, setStep] = useState<"credentials" | "role">("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    acceptTerms: false,
  });
  
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === "credentials") {
      if (!formData.acceptTerms) {
        toast({
          title: "Conditions d'utilisation",
          description: "Veuillez accepter les conditions d'utilisation pour continuer",
          variant: "destructive",
        });
        return;
      }
      setStep("role");
      return;
    }

    if (!selectedRole) {
      toast({
        title: "Sélection du rôle",
        description: "Veuillez sélectionner votre rôle pour continuer",
        variant: "destructive",
      });
      return;
    }
    
    await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      selectedRole
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {step === "credentials" ? "Créez votre compte" : "Choisissez votre rôle"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {step === "credentials" 
              ? "Rejoignez notre communauté en quelques étapes simples"
              : "Sélectionnez le rôle qui correspond le mieux à vos besoins"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === "credentials" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères, une majuscule, un chiffre
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("acceptTerms", checked as boolean)
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-none cursor-pointer"
                >
                  J'accepte les{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    conditions générales
                  </Link>{" "}
                  et la{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
            </div>
          ) : (
            <RoleSelector
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
            />
          )}

          <div className="space-y-4">
            <Button type="submit" className="w-full text-lg py-6">
              {step === "credentials" ? "Continuer" : "Créer mon compte"}
            </Button>

            {step === "credentials" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou inscrivez-vous avec
                    </span>
                  </div>
                </div>

                <SocialConnect />
              </>
            )}

            <p className="text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;