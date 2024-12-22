import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {loginUser, registerUser} from '../redux/features/auth/authSlice'
// import { checkIsAuth} from '../redux/features/auth/authSlice'

import { toast } from 'react-toastify'

export const RegisterPage = () => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rep_password, setRepPassword] = useState('')

    const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)


  // const isAuth = useSelector(checkIsAuth)
  const navigate = useNavigate()
  // error
  const { status } = useSelector((state) => state.auth)

  useEffect(() => {
    if (status) {
      toast(status)
    }
    if (user) navigate('/')
  }, [status, user, navigate])
  // error

  // const handleSubmit = () => {
  //   try {
  //     dispatch(registerUser({ username, email, password }))
  //     setPassword('')
  //     setEmail('')
  //     setUserName('')
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(password===rep_password) {
        const response = await dispatch(registerUser({username, email, password}));
        // setPassword('')
        // setEmail('')
        // setUserName('')
        if (response.payload && response.payload.length > 0) {
          const validationErrors = response.payload.map((error) => error.msg);
          toast.error(validationErrors.join(', '));
        }
      }
      else{
        toast.error('Пароли не совпадаю')
      }
    } catch (error) {
      console.log(error);
    }
  };

    return (
    <form onSubmit={e => e.preventDefault()}
      className={'flex flex-col mx-auto xl:w-96 pt-5 pb-5 w-80 mt-24 border-2 border-green-500  rounded-lg'}>
      <h1 className={'text-lime-900 font-bold xl:text-3xl text-2xl opacity-80 text-center'}>Регистрация</h1>

      <label className={'flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center xl:mt-1 mt-3'}>
        username:
        <input type={"text"}
          value={username}
          onChange={e => setUserName(e.target.value)}
          placeholder={'Введите имя пользователя'}
          className={'flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'} />
      </label>

      <label className={'flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center xl:mt-1 mt-3'}>
        email:
        <input type={"email"}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={'Введите почту'}
          className={'flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'} />
      </label>

      <label className={'flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center xl:mt-1 mt-3'}>
        password:
        <input type={"password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={'Введите пароль'}
          className={'flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'} />
      </label>

        <label className={'flex flex-col xl:text-xl text-xs xl:text-2xl text-lime-900 items-center justify-center xl:mt-1 mt-3'}>
          repeat password:
        <input type={"password"}
          value={rep_password}
          onChange={e => setRepPassword(e.target.value)}
          placeholder={'Повторно введите пароль'}
          className={'flex mt-1 text-cyan-950 xl:w-80 w-64 xl:text-2xl rounded-lg border-2 border-cyan-950 bg-transparent py-1 px-2 outline-none placeholder:text-medium-gray placeholder:text-sm xl:placeholder:text-xl focus:border-emerald-700 focus:bg-emerald-700 focus:text-almost-white focus:placeholder:text-amber-50'} />
      </label>

      <div className={'flex gap-8 justify-center mt-4'}>
        {(username && email && password && rep_password)
            ?
          <button type={'submit'}
                  onClick={handleSubmit}
                  className={`text-white bg-cyan-950 px-2 py-1 xl:px-5 xl:py-2 border-2 border-cyan-950 rounded-lg hover:bg-transparent hover:text-almost-black border-2 `}
          >Регистрация</button>
            : <></>
        }
        <Link to={'/login'}
          className={'flex justify-center items-center text-sm xl:text-xl text-lime-700'}>Есть аккаунт?</Link>
      </div>
    </form>
  )
}
