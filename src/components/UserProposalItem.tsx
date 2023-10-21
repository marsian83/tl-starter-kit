import { renderTokenAmount } from '../utils/conversion';
import { IProposal, ProposalStatusEnum } from '../types';
import { formatDate } from '../utils/dates';
import Link from 'next/link';
import Image from 'next/image';
import { useTalentLayer } from '@talentlayer/react/dist';
import { useService } from '@talentlayer/react/dist';

function UserProposalItem({ proposal }: { proposal: IProposal }) {
  const { user } = useTalentLayer();
  const [service, loading] = useService(proposal.service.id);

  if (!service) {
    return null;
  }

  const isBuyer = user?.id === proposal.service.buyer.id;

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-700 text-white bg-endnight'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          {!loading && (
            <div className='flex items-center justify-start w-full  relative'>
              <Image
                src={`/images/default-avatar-${Number(proposal.service.buyer.id) % 9}.jpeg`}
                className='w-10 mr-4 rounded-full'
                width={50}
                height={50}
                alt='default avatar'
              />
              <div className='flex flex-col'>
                <p className='text-gray-100 font-medium break-all'>{service.description?.title}</p>
                <p className='text-xs text-gray-500'>
                  Gig created by {proposal.service.buyer.handle} the{' '}
                  {formatDate(Number(proposal.service.createdAt) * 1000)}
                </p>
              </div>

              <span className='absolute right-[-25px] top-[-25px] inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800'>
                {proposal.status}
              </span>
            </div>
          )}

          <div className=' border-t border-gray-100 pt-4'>
            <p className='text-sm text-gray-400 mt-4'>
              <strong>Proposal:</strong> created by {proposal.seller.handle} the{' '}
              {formatDate(Number(proposal.createdAt) * 1000)}
            </p>
            <p className='text-sm text-gray-400 mt-4'>
              <strong>Message:</strong> {proposal.description?.title}
            </p>
            <p className='text-sm text-gray-400 mt-4'>
              <strong>Expiration Date:</strong> {formatDate(Number(proposal.expirationDate) * 1000)}
            </p>
          </div>
        </div>
        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-700 pt-4'>
          <p className='text-gray-400 font-bold line-clamp-1 flex-1'>
            {renderTokenAmount(proposal.rateToken, proposal.rateAmount)}
          </p>
          <Link
            className='text-zinc-600 bg-zinc-50 hover:bg-zinc-500 hover:text-white px-3 py-2 rounded text-sm'
            href={`/dashboard/services/${proposal.service.id}`}>
            Show Gig
          </Link>
          {isBuyer && proposal.status === ProposalStatusEnum.Pending && (
            <button className='text-green-600 bg-green-50 hover:bg-redpraha hover:text-white px-5 py-2 rounded'>
              Validate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProposalItem;
