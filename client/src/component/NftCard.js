import { ethers } from 'ethers'
import React from 'react'
import { useNavigate } from 'react-router'
import { truncate, useGlobalState } from '../utils'

function NftCard({ item }) {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(`/NftPage/${item?.itemId}/${item?.name}`)} className=' flex flex-col justify-center border-[1px]
     bg-white p-2 border-blue-400 w-96 rounded-xl cursor-pointer'>
        <img src={`https://gateway.pinata.cloud/ipfs//${item?.image.substring(6)}`} className="h-72 w-72 object-cover rounded mx-auto" /> 
        <div className='p-3 flex flex-col text-gray-600 '>
            <h3 className='text-3xl font-semibold'>{item?.name}</h3>
            <p className='truncate text-base font-semibold '>{item?.description}</p>
            <h3 className='text-xl'>Price: {item?.price}</h3>
            <h3 className='text-base justify-between flex flex-row items-center '>
              <p>Seller:</p>
              <p>{truncate(item?.seller,4,4,11)}</p>
             </h3>
            <div className='flex flex-row items-center justify-between '>
                <h3>Status:</h3>
                <div>{!item?.sold ?
                 (<span className='font-semibold text-green-500 text-base'>For sale</span>) 
                 : (<span className='font-semibold text-red-500 text-base'>Sold</span>)}</div>
            </div>
        </div>
    </div>
  )
}

export default NftCard