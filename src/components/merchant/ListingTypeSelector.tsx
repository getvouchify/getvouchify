import { LISTING_TYPES, ListingType } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tag, Gift, Percent } from "lucide-react";

interface ListingTypeSelectorProps {
  value: ListingType;
  onChange: (value: ListingType) => void;
}

const iconMap = {
  tag: Tag,
  gift: Gift,
  percent: Percent,
};

export const ListingTypeSelector = ({ value, onChange }: ListingTypeSelectorProps) => {
  return (
    <RadioGroup value={value} onValueChange={(val) => onChange(val as ListingType)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LISTING_TYPES.map((type) => {
          const Icon = iconMap[type.icon as keyof typeof iconMap];
          const isSelected = value === type.value;

          return (
            <Card 
              key={type.value}
              className={`cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onChange(type.value as ListingType)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <RadioGroupItem value={type.value} checked={isSelected} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{type.label}</CardTitle>
                    {type.default && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </RadioGroup>
  );
};
