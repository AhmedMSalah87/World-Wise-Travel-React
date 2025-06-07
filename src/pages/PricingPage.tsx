import priceIMG from "../assets/img-2.jpg";
import NavBar from "../components/NavBar";

const PricingPage = () => {
  return (
    <main className="py-6 px-12  m-6 bg-secondary">
      <NavBar />
      <section className="grid grid-cols-2 gap-18 my-15 m-auto items-center w-[80%]">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Simple pricing. <br />
            Just $9/month.
          </h2>
          <p className="text-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae vel
            labore mollitia iusto. Recusandae quos provident, laboriosam fugit
            voluptatem iste.
          </p>
        </div>
        <img src={priceIMG} alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
};

export default PricingPage;
