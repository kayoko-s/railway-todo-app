import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.scss'

const EditTask = () => {
  const navigate = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies, ] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [dueDate, setDueDate] = useState('') // 追加
  const [isDone, setIsDone] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleDueDateChange = (e) => setDueDate(e.target.value) // 追加
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')
  const onUpdateTask = () => {
    console.log(isDone)
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: new Date(dueDate).toISOString() // 追加
    }
    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`)
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        setTitle(task.title)
        setDetail(task.detail)
        setDueDate(task.limit) // 追加
        setIsDone(task.done)
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [cookies.token, listId, taskId])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label htmlFor='editTaskTitle'>タイトル</label>
          <br />
          <input
            type="text"
            id='editTaskTitle'
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label htmlFor='editTaskDetail'>詳細</label>
          <br />
          <textarea
            type="text"
            id='editTaskDetail'
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label htmlFor='editTaskDueDate'>期日日時</label> {/* 追加 */}
          <br />
          <input 
            id='editTaskDueDate'
            type='datetime-local'
            onChange={handleDueDateChange}
            className='edit-task-due-date'
            value={dueDate}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}

export default EditTask
