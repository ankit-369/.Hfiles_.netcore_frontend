import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Search = () => {

    return (
        
      <div className="flex justify-end mt-2">
      <button
        className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition"
        aria-label="Search"
      >
        <i className="fa fa-search text-white text-sm"></i>
      </button>
    </div>
    )

}


export default Search;