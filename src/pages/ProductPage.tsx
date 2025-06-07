import NavBar from "../components/NavBar";
import productIMG from "../assets/img-1.jpg";

const ProductPage = () => {
  return (
    <main className="py-6 px-12 m-6 bg-secondary">
      <NavBar />
      <section className="grid grid-cols-2 gap-18 my-15 m-auto items-center w-[80%]">
        <img src={productIMG} alt="" />
        <div className="text-foreground">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            About WorldWide.
          </h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo est
            dicta illum vero culpa cum quaerat architecto sapiente eius non
            soluta, molestiae nihil laborum, placeat debitis, laboriosam at fuga
            perspiciatis?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis
            doloribus libero sunt expedita ratione iusto, magni, id sapiente
            sequi officiis et.
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
