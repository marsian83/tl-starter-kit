'use client';

import { Field, Form, Formik } from 'formik';
import { useContext, useMemo, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { executePayment } from '../../contracts/executePayment';
import { IService, IToken, ServiceStatusEnum } from '../../types';
import { renderTokenAmount } from '../../utils/conversion';
import { useChainId } from '../../hooks/useChainId';
import { useTalentLayer } from '@talentlayer/react/dist';

interface IFormValues {
  percentField: string;
}

interface IReleaseFormProps {
  totalInEscrow: bigint;
  rateToken: IToken;
  service: IService;
  isBuyer: boolean;
  closeModal: () => void;
}

function ReleaseForm({
  totalInEscrow,
  rateToken,
  service,
  closeModal,
  isBuyer,
}: IReleaseFormProps) {
  const chainId = useChainId();
  const { user, client: talentLayerClient } = useTalentLayer();
  const publicClient = usePublicClient({ chainId });

  const [percent, setPercentage] = useState(0);

  const handleSubmit = async () => {
    if (!user || !publicClient) {
      return;
    }
    const percentToToken = (totalInEscrow * BigInt(percent)) / BigInt(100);

    if (talentLayerClient) {
      await executePayment(
        chainId,
        user.address,
        publicClient,
        user.id,
        service.transaction.id,
        percentToToken,
        isBuyer,
        false,
        // isActiveDelegate,
        talentLayerClient as any,
        service.id,
      );
    }

    closeModal();
  };

  const releaseMax = () => {
    setPercentage(100);
  };

  const releaseMin = () => {
    setPercentage(1);
  };

  const onChange = (e: any) => {
    const percentOnChange = e.target.value;
    if (percentOnChange <= 100 && percentOnChange >= 0) {
      setPercentage(percentOnChange);
    }
  };

  const amountSelected = useMemo(() => {
    return percent ? (totalInEscrow * BigInt(percent)) / BigInt(100) : '';
  }, [percent]);

  const initialValues: IFormValues = {
    percentField: '50',
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col px-4 py-6 md:p-6 xl:p-6 w-full bg-gray-50 space-y-6'>
        {service.status === ServiceStatusEnum.Confirmed && (
          <h3 className='text-xl font-semibold leading-5 text-gray-800'>
            Select the % amount to release
          </h3>
        )}
        <div className='flex space-x-2 flex-row'>
          <div className='items-center rounded-b border-redpraha '>
            <button
              type='button'
              onClick={releaseMin}
              className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl border border-redpraha text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
              Min
            </button>
          </div>
          <div className='items-center  rounded-b border-redpraha '>
            <button
              type='button'
              onClick={releaseMax}
              className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl border border-redpraha text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
              Max
            </button>
          </div>
        </div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <div className='sm:px-6 justify-between bg-white flex flex-row items-center gap-2'>
              <div>
                <span className='text-base font-semibold leading-4 text-gray-800'>% </span>
                <Field
                  type='number'
                  label='Pourcent'
                  className='text-gray-500 py-2 focus:outline-none text-sm sm:text-lg border-0'
                  placeholder='between 0 and 100'
                  id='pourcentField'
                  name='pourcentField'
                  required
                  value={percent ? percent : ''}
                  onChange={onChange}
                />
              </div>
              {
                <div className='pr-2 text-base font-semibold leading-4 text-gray-400  '>
                  {renderTokenAmount(rateToken, amountSelected ? amountSelected.toString() : '0')}
                </div>
              }
            </div>
            <div className='flex items-center pt-6 space-x-2 rounded-b border-redpraha '>
              {totalInEscrow > 0 && (
                <button
                  type='submit'
                  className=' hover:bg-endnight text-white bg-redpraha px-5 py-2 rounded-xl'>
                  {isBuyer ? 'Release the selected amount' : 'Reimburse the selected amount'}
                </button>
              )}
              <button
                onClick={closeModal}
                type='button'
                className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-xl border border-redpraha text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
                Close
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ReleaseForm;
