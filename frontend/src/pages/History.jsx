import React, { useEffect, useState } from 'react'
import api from '../services/axios'
import { RefreshCw, Download, ImageIcon, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const History = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await api.get('/images/')
      setTasks(response.data.results || response.data)
    } catch (err) {
      console.error("Failed to load history", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return
    try {
      await api.delete(`/images/${id}/`)
      toast.success("Image deleted successfully")
      fetchHistory()
    } catch (err) {
      toast.error("Failed to delete image")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">Completed</span>
      case 'PROCESSING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">Processing</span>
      case 'FAILED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">Failed</span>
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">History</h2>
          <p className="text-muted-foreground">View and download your previously processed images.</p>
        </div>
        <button 
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors font-medium text-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card opacity-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-3">
             <RefreshCw size={20} className="animate-spin text-primary" /> Loading history...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-lg font-medium">No images found</h3>
            <p className="text-muted-foreground mt-1">You haven't processed any images yet.</p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b [&_tr]:border-border">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-muted overflow-hidden border border-border flex items-center justify-center">
                          {task.original_image ? 
                            <img src={task.original_image} alt="Original" className="h-full w-full object-cover" /> : 
                            <ImageIcon className="text-muted-foreground" size={20} />
                          }
                        </div>
                        <span className="font-medium max-w-[150px] truncate text-foreground">{task.id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="p-4 align-middle text-right filter gap-2 justify-end flex items-center">
                      {task.status === 'COMPLETED' && task.processed_image ? (
                        <a 
                          href={task.processed_image} 
                          target="_blank" 
                          rel="noreferrer"
                          download
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-xs font-semibold"
                        >
                          <Download size={14} /> Download
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs italic mr-2">Unavailable</span>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
