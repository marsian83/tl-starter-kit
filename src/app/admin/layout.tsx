'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../../components/Layout/Logo';
import MenuBottom from '../../components/Layout/MenuBottom';
import SideMenu from '../../components/Layout/SideMenu';
import NetworkSwitch from '../../components/NetworkSwitch';
import UserAccount from '../../components/UserAccount';
import React, { Fragment, ReactNode, useState } from 'react';

export default function Layout(props: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className={' dashboard pb-[110px]'}>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as='div' className='relative z-40 md:hidden' onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'>
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-midnight pt-5 pb-4'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}>
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon className='h-6 w-6 text-white' aria-hidden='true' />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex flex-shrink-0 items-center px-4'>
                    <Logo />
                  </div>
                  <div className='mt-5 h-0 flex-1 overflow-y-auto'>
                    <SideMenu />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0' aria-hidden='true'>
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-700'>
          <div className='flex flex-grow flex-col overflow-y-auto bg-endnight pt-5'>
            <div className='flex flex-shrink-0 items-center px-6'>
              <Logo />
            </div>
            <div className='mt-8 flex flex-1 flex-col justify-between'>
              <SideMenu />
            </div>
          </div>
        </div>

        <div className='flex flex-1 flex-col md:pl-64'>
          <div className='top-0 z-10 flex h-16 flex-shrink-0 bg-midnight'>
            <div className='flex flex-1 items-center pl-6'>
              <div className='sm:hidden'>
                <Logo />
              </div>
            </div>
            <NetworkSwitch />
            <UserAccount />
          </div>

          <main>
            <div className={`p-6`}>{props.children}</div>
          </main>
        </div>
      </div>

      <MenuBottom />
    </>
  );
}
