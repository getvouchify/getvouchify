import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Chidinma Okafor",
    role: "Regular Customer",
    rating: 5,
    text: "I've saved thousands on dining and spa treatments! The voucher system is so easy to use, and I love discovering new places through Vouchify.",
    avatar: "CO",
  },
  {
    name: "Adebayo Adeleke",
    role: "Fitness Enthusiast",
    rating: 5,
    text: "The gym membership deals are incredible. I've tried 3 different studios at a fraction of the cost. Perfect for exploring what fits my lifestyle.",
    avatar: "AA",
  },
  {
    name: "Fatima Ibrahim",
    role: "Restaurant Owner",
    rating: 5,
    text: "Vouchify brought in so many new customers! The escrow payment system gives us peace of mind, and the analytics help us optimize our offers.",
    avatar: "FI",
  },
  {
    name: "Oluwatobi Adeyemi",
    role: "Beauty Salon Owner",
    rating: 5,
    text: "We've increased our foot traffic by 40% since joining Vouchify. The platform is easy to use and customer support is excellent.",
    avatar: "OA",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy shoppers and successful merchants
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="bg-white rounded-xl p-8 shadow-card hover-lift h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
