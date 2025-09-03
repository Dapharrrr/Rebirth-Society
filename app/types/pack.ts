export type Pack = {
  id: string
  name: string
  description: string
  price: number
  image: string
  createdAt: Date
  _count?: {
    videos: number
  }
}
