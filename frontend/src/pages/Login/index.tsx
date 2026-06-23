import FormLogin from './FormLogin';
import PartitionBanner from './PartitionBanner';

const LoginPage = () => {
  return (
    <section className="mx-auto grid min-h-[520px] w-full grid-cols-1 overflow-hidden rounded-lg border border-gray-200/80 bg-white text-gray-700 sm:w-[580px] sm:grid-cols-2 lg:min-h-[720px] lg:w-[920px]">
      <PartitionBanner />
      <FormLogin />
    </section>
  );
};

export default LoginPage;
