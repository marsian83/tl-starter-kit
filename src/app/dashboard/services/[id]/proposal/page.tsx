'use client';

import { useContext } from 'react';
import ProposalForm from '../../../../../components/Form/ProposalForm';
import Loading from '../../../../../components/Loading';
import Steps from '../../../../../components/Steps';
import ConnectButton from '../../../../../modules/Messaging/components/ConnectButton';
import MessagingContext from '../../../../../modules/Messaging/context/messging';
import { ProposalStatusEnum, ServiceStatusEnum } from '../../../../../types';
import {
  useProposal,
  useService,
  useTalentLayer,
} from '@talentlayer/react/dist';

export default function CreateOrEditProposal(props: { params: { id: string } }) {
  const { account, user } = useTalentLayer();
  const { userExists } = useContext(MessagingContext);
  const { id } = props.params;
  const [service, loadingService] = useService(id);
  const [existingProposal, loadingProposal] = useProposal(`${id}-${user?.id}`);

  if (loadingService || loadingProposal) {
    return <Loading />;
  }

  if (!user) {
    return <Steps />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <div className='-mx-6 -mt-6 sm:mx-0 sm:mt-0'>
        <p className='flex py-2 px-6 sm:px-0 items-center text-2xl font-medium tracking-wider mb-8 border-b w-full border-gray-700 md:px-8 '>
          {existingProposal &&
          existingProposal.status === ProposalStatusEnum.Pending &&
          service.status === ServiceStatusEnum.Opened ? (
            <>Edit your proposal</>
          ) : service.status !== ServiceStatusEnum.Opened ? (
            <>
              This service is not <span className='text-gray-100'>open </span> for proposals any
              more
            </>
          ) : (
            <>Create a proposal</>
          )}
        </p>
      </div>

      {!userExists() && account?.isConnected && user && (
        <div className='border border-redpraha rounded-xl p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a proposal, you need to be registered to our decentralized messaging
            service. Please sign in to our messaging service to verify your identity :
          </p>
          <ConnectButton />
        </div>
      )}

      {userExists() &&
        account?.isConnected &&
        user &&
        service.status === ServiceStatusEnum.Opened && (
          <ProposalForm user={user} service={service} existingProposal={existingProposal} />
        )}
    </div>
  );
}
