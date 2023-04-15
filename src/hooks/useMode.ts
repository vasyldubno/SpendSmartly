import { useContext } from 'react'
import { ChangeContext } from '@/context/ChangeContext'

export const useMode = () => useContext(ChangeContext)
