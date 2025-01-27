import { useContext } from 'react';
import TalentLayerIdForm from '../Form/TalentLayerIdForm';
import { useTalentLayer } from '@talentlayer/react/dist';

function CreateId() {
  const { user } = useTalentLayer()

  if (user) {
    return null;
  }

  return (
    <>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0 py-20'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <p className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'>
              Create <span className='text-gray-100'>Your </span> TalentLayer ID
            </p>

            <p className='text-gray-500 text-center'>
              Own your reputation as an independent and anoymous freelancer.
              <br />
              Onboard your clients, leave mutual reviews, and grow your reputation.
            </p>

            <TalentLayerIdForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateId;
