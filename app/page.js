'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, quantity: doc.data().quantity || 0 })
    })
    setPantry(pantryList)
  }
  
  const addItem = async (item) => {
    if (!item.trim()) return; // Prevent adding empty items
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: (quantity || 0) + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updatePantry()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: (quantity || 1) - 1 })
      }
    }
    await updatePantry()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  
  useEffect(() => {
    updatePantry()
  }, [])

  const filteredPantry = pantry.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#f5f5f5'}
      p={4}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Item
      </Button>
      <TextField
        id="search"
        label="Search Items"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Box
        width="80%"
        p={2}
        borderRadius={2}
        bgcolor={'#ffffff'}
        boxShadow={3}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <Box
          width="100%"
          height="100px"
          bgcolor={'#1976d2'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={1}
          mb={2}
        >
          <Typography variant={'h2'} color={'#ffffff'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="100%" spacing={2} overflow={'auto'}>
          {filteredPantry.map(({ name, quantity }) => (
            <Card key={name} sx={{ minWidth: 275, mb: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" onClick={() => removeItem(name)}>Remove</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
