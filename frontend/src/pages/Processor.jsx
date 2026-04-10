import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { UploadCloud, FileImage, Loader2, AlertCircle, RefreshCw, CheckCircle2, Download as DownloadIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/axios'

const Processor = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [task, setTask] = useState(null)
  const [downloadName, setDownloadName] = useState('image_nobg.png')
  
  const [status, setStatus] = useState('IDLE') // IDLE, UPLOADING, PROCESSING, COMPLETED, FAILED

  // Handle Drop
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setStatus('IDLE')
      setTask(null)
      setDownloadName(selectedFile.name.replace(/\.[^/.]+$/, "") + "_nobg.png")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
    maxSize: 5242880, // 5MB
    multiple: false
  })

  // Start Upload
  const handleProcess = async () => {
    if (!file) return
    setStatus('UPLOADING')
    
    const formData = new FormData()
    formData.append('original_image', file)

    try {
      const response = await api.post('/images/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTask(response.data)
      setStatus('PROCESSING')
      // Assuming Celery task starts now
      pollStatus(response.data.id)
    } catch (err) {
      console.error(err)
      setStatus('FAILED')
      toast.error(err.response?.data?.original_image?.[0] || 'Upload failed.')
    }
  }

  // Poll for status
  const pollStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/images/${taskId}/`)
        const data = res.data
        if (data.status === 'COMPLETED') {
          setTask(data)
          setStatus('COMPLETED')
          toast.success("Background removed successfully!")
          clearInterval(interval)
        } else if (data.status === 'FAILED') {
          setStatus('FAILED')
          toast.error("Processing failed on server.")
          clearInterval(interval)
        }
      } catch (err) {
        clearInterval(interval)
      }
    }, 3000) // Poll every 3 seconds
  }

  const handleDownload = async () => {
    if (!task || !task.processed_image) return;
    try {
      const response = await fetch(task.processed_image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName.endsWith('.png') ? downloadName : `${downloadName}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download image securely');
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setTask(null)
    setStatus('IDLE')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Process Image</h2>
        <p className="text-muted-foreground">Upload an image to magically remove its background using AI.</p>
      </div>

      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center transition-all bg-card min-h-[400px] cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}
            ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Click to upload or drag and drop</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4 text-foreground">Image Details</h3>
              <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
                <FileImage className="text-primary shrink-0" size={24} />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {status === 'IDLE' && (
                <div className="space-y-3">
                  <button 
                    onClick={handleProcess}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Remove Background
                  </button>
                  <button 
                    onClick={reset}
                    className="w-full py-2.5 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {(status === 'UPLOADING' || status === 'PROCESSING') && (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm font-medium animate-pulse text-foreground">
                    {status === 'UPLOADING' ? 'Uploading image...' : 'AI is removing background...'}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">This may take a few seconds.</p>
                </div>
              )}

              {status === 'COMPLETED' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-500 font-medium justify-center py-2">
                    <CheckCircle2 size={20} /> Success
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Output Filename</label>
                    <input 
                      type="text" 
                      value={downloadName}
                      onChange={(e) => setDownloadName(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors gap-2"
                  >
                    <DownloadIcon size={18} /> Download Result
                  </button>
                  <button 
                    onClick={reset}
                    className="w-full py-2.5 border border-border text-foreground font-medium rounded-md hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} /> Process Another
                  </button>
                </div>
              )}

              {status === 'FAILED' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-destructive font-medium justify-center py-2">
                    <AlertCircle size={20} /> Processing Failed
                  </div>
                  <button 
                    onClick={reset}
                    className="w-full py-2.5 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Visuals Panel */}
          <div className="lg:col-span-2">
            <div className="bg-muted border border-border rounded-xl  overflow-hidden flex items-center justify-center min-h-[400px] h-full relative"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v10H0zm10 10h10v10H10z' fill='%23e5e7eb' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                 }}
            >
              {status === 'COMPLETED' && task?.processed_image ? (
                <div className="w-full h-full sm:p-4">
                  <ReactCompareSlider
                    boundsPadding={0}
                    itemOne={<ReactCompareSliderImage src={preview} alt="Original" />}
                    itemTwo={<ReactCompareSliderImage src={task.processed_image} alt="Without Background" />}
                    className="h-full w-full rounded-lg shadow-2xl"
                  />
                </div>
              ) : (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className={`max-h-[600px] max-w-full object-contain p-4 transition-opacity duration-500
                    ${(status === 'UPLOADING' || status === 'PROCESSING') ? 'opacity-30 blur-sm' : 'opacity-100'}`
                  } 
                />
              )}
              
              {/* Optional Scanning Overlay for visual effect during processing */}
              {status === 'PROCESSING' && (
                 <div className="absolute inset-0 z-10 w-full overflow-hidden pointer-events-none">
                    <div className="h-1 w-full bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.5)] absolute animate-[scan_2s_ease-in-out_infinite]" />
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add simple scan keyframe for the UI
const style = document.createElement('style');
style.innerHTML = `
@keyframes scan {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
`;
document.head.appendChild(style);

export default Processor
