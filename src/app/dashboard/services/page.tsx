'use client';

import { useSearchParams } from 'next/navigation';
import SearchServiceButton from '../../../components/Form/SearchServiceButton';
import Loading from '../../../components/Loading';
import ServiceItem from '../../../components/ServiceItem';
import { IService, ServiceStatusEnum } from '../../../types';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useServices } from '@talentlayer/react/dist';

export default function Services() {
  const PAGE_SIZE = 30;
  const query = useSearchParams();
  const searchQuery = query && query.get('search');

  const [services, loading, error] = useServices({
    serviceStatus: ServiceStatusEnum.Opened,
    searchQuery: searchQuery?.toLowerCase(),
    numberPerPage: PAGE_SIZE,
  });

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <div className='-mx-6 -mt-6 sm:mx-0 sm:mt-0'>
        <div className='flex py-2 px-6 sm:px-0 items-center border-b w-full border-gray-700 mb-8'>
          <p className='text-2xl font-medium flex-1'>
            All <span className='text-gray-100 ml-1'> Gigs </span>
          </p>
          <Link
            href={`/dashboard/services/create`}
            className=' hover:bg-endnight text-white bg-endnight px-3 py-2 text-sm flex items-center rounded-xl'>
            <PlusCircleIcon className='w-[18px] h-[18px] text-redpraha mr-2' />
            Create Gig
          </Link>
        </div>
      </div>
      {searchQuery && services.items.length > 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          Search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}
      {searchQuery && services.items.length === 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          No search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchServiceButton value={searchQuery || ''} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {services.items.map((service: IService, i: number) => {
          return <ServiceItem service={service} key={i} />;
        })}
      </div>

      {services.items.length > 0 && services.canLoadMore && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5'>
          <button
            type='submit'
            className={`px-5 py-2 mt-5 content-center border border-zinc-600 rounded-full text-zinc-600 
              hover:text-white hover:bg-midnight
            `}
            disabled={!services.canLoadMore}
            onClick={services.loadMore}>
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <Loading />
        </div>
      )}
      {!services.canLoadMore && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <p>No more Services...</p>
        </div>
      )}
    </div>
  );
}
