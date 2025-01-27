"use client"

import { useSearchParams } from 'next/navigation';
import SearchTalentButton from '../../../components/Form/SearchTalentButton';
import Loading from '../../../components/Loading';
import UserItem from '../../../components/UserItem';
import { useUsers } from '@talentlayer/react/dist';

export default function Page() {
  const PAGE_SIZE = 36;
  const query = useSearchParams();
  const searchQuery = query && (query as any).search as string;
  //   const { users, hasMoreData, loading, loadMore }
  const [users, loading] = useUsers({
    searchQuery: searchQuery?.toLocaleLowerCase(),
    numberPerPage: PAGE_SIZE,
  });

  return (
    <div className='max-w-7xl mx-auto text-gray-200 sm:px-4 lg:px-0'>
      <div className='-mx-6 -mt-6 sm:mx-0 sm:mt-0'>
        <p className='flex py-2 px-6 sm:px-0 items-center text-2xl font-medium tracking-wider mb-8 border-b w-full border-gray-700 md:px-8 '>
          All <span className='text-gray-100 ml-1'> Talents </span>
        </p>
      </div>

      {searchQuery && users.items.length > 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          Search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}
      {searchQuery && users.items.length === 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          No search results for <span className='text-gray-100'>{searchQuery}</span>
        </p>
      )}

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchTalentButton value={searchQuery || undefined} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {users.items.map((user, i) => {
          return <UserItem user={user} key={i} />;
        })}
      </div>

      {users.items.length > 0 && users.hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5'>
          <button
            type='submit'
            className={`px-5 py-2 mt-5 content-center border border-zinc-600 rounded-full text-zinc-600 
              hover:text-white hover:bg-midnight
            `}
            disabled={!users.hasMoreData}
            onClick={users.loadMore}>
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <>someting</>
          <Loading />
        </div>
      )}
      {!users.hasMoreData && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <p>No more Users...</p>
        </div>
      )}
    </div>
  );
}
