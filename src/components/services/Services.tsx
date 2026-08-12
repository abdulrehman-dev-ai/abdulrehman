import { getPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import { ServiceCard } from "@/components/ServiceCard";

interface ServicesProps {
  range?: [number, number?];
}

export function Services({ range }: ServicesProps) {
  const allServices = getPosts(["src", "app", "services", "items"]);

  const displayedServices = range
    ? allServices.slice(range[0] - 1, range[1] ?? allServices.length)
    : allServices;

  return (
    <Grid
      fillWidth
      gap="xl"
      marginBottom="40"
      paddingX="m"
      columns="3"
      tabletColumns="2"
      mobileColumns="1"
      style={{
        alignItems: "stretch",
        justifyItems: "center",
      }}
    >
      {displayedServices.map((service) => (
        <ServiceCard
          key={service.slug}
          href={`/services/${service.slug}`}
          image={service.metadata.images[0]}
          title={service.metadata.title}
          description={service.metadata.summary}
          category={service.metadata.category}
          price={service.metadata.price}
          currency={service.metadata.currency}
          priceNote={service.metadata.priceNote}
          deliveryTime={service.metadata.deliveryTime}
        />
      ))}
    </Grid>
  );
}
