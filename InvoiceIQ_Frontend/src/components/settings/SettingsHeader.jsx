function SettingsHeader() {
return ( <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-400"> <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="1.8"
           className="h-6 w-6"
           aria-hidden="true"
         > <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
           /> <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3H3.7a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"
           /> </svg> </div>


      <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
        Settings
      </h1>
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-400 sm:ml-14">
      Manage your account, business profile, and application preferences.
    </p>
  </div>

  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300">
    <span className="h-2 w-2 rounded-full bg-emerald-400" />
    Account Settings
  </span>
</div>

)
}

export default SettingsHeader
