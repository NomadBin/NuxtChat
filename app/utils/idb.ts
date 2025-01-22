import { init, getInstance } from 'ts-indexdb';
import { getModelDisplayName } from '~/config/llm-models';
import type { ChatSession } from '~~/types/chat';

const dbName = 'nuxtchat';
const sessionTableName = 'sessions';

async function initDb() {
  await init({
    dbName: dbName, // 数据库名称
    version: 1, // 版本号
    tables: [
      {
        tableName: sessionTableName, // 表名
        option: { keyPath: 'id' }, // 指明主键为id
        indexs: [
          // 数据库索引
          {
            key: 'id',
            option: {
              unique: true,
            },
          },
        ],
      },
    ],
  });
}

async function getSessinById(sessionId: string) {
  const session = await getInstance().query_by_keyValue<ChatSession>({
    tableName: sessionTableName,
    key: 'id',
    value: sessionId,
  });
  return session;
}
async function getSessionList(searchVal: string) {
  let sessions = await getInstance().queryAll<ChatSession>({
    tableName: sessionTableName,
  });

  let mySessions = sessions
    .map((session) => {
      return {
        ...session,
        _matchMessage: '',
        _matchTitle: session.topic,
      };
    })
    .filter((session) => {
      const searchRegex = new RegExp(`(${searchVal})`, 'gi');

      // 匹配标题
      if (session.topic.match(searchRegex)) {
        if (searchVal) {
          session._matchTitle = session.topic.replace(searchRegex, '<em>$1</em>');
        }
        return true;
      }

      // 匹配用户查询问题
      if (
        session.chats.some((chat, index) => {
          const matches = chat.query.match(searchRegex);
          if (matches) {
            console.log('matches query', matches);
            if (searchVal) {
              session._matchMessage = chat.query.replace(searchRegex, '<em>$1</em>');
            }
          }
          return matches;
        })
      ) {
        return true;
      }

      // 匹配模型回答
      let isMatchAnswer = false;
      for (const chat of session.chats) {
        if (
          chat.answers.some((answer) => {
            const matches = answer.content.match(searchRegex);
            if (matches) {
              console.log('matches answers', matches);
              if (searchVal) {
                let result = answer.content;
                let realResult = `${getModelDisplayName(answer.modeId)}:`;
                const keepWordNum = 8;
                matches.forEach((match) => {
                  // 截断匹配到的关键词
                  const index = result.indexOf(match);
                  const start = Math.max(0, index - keepWordNum);
                  const end = Math.min(result.length, index + match.length + keepWordNum);
                  let snippet = result.substring(start, end);
                  console.log('snippet', snippet);
                  snippet = snippet.replace(searchRegex, '<em>$1</em>');
                  realResult += snippet;
                });
                session._matchMessage = realResult;
              }
            }
            return matches;
          })
        ) {
          isMatchAnswer = true;
          break;
        }
      }
      if (isMatchAnswer) {
        return true;
      }

      return false;
    });

  return mySessions;
}

async function insertSession(session: ChatSession) {
  await getInstance().insert<ChatSession>({
    tableName: sessionTableName,
    data: session,
  });
}

async function deleteSession(sessionId: string) {
  await getInstance().delete<ChatSession>({
    tableName: sessionTableName,
    condition: (item) => item.id === sessionId,
  });
}

// async function querySession() {
//   const data = await getInstance().query<ChatSession>({
//     tableName: sessionTableName,
//     condition: (item) => item.topic === '测试',
//   });
//   console.log('data', data);
//   return data;
// }

async function updateSession(session: ChatSession) {
  await getInstance().update<ChatSession>({
    tableName: sessionTableName,
    condition: (item) => item.id === session.id,
    handle: (r) => {
      r.topic = session.topic;
      r.modelIds = deepClone(session.modelIds);
      r.chats = deepClone(session.chats);
      r.date = session.date;
      r.memoryObj = deepClone(session.memoryObj);
      return r;
    },
  });
}

async function renameSession(sessionId: string, topic: string) {
  await getInstance().update<ChatSession>({
    tableName: sessionTableName,
    condition: (item) => item.id === sessionId,
    handle: (r) => {
      r.topic = topic;
      return r;
    },
  });
}

// async function deleteTable() {
//   await getInstance().delete_table(sessionTableName);
// }

async function deleteDb() {
  await getInstance().delete_db(dbName);
}

export default {
  initDb,
  getSessinById,
  getSessionList,
  insertSession,
  deleteSession,
  // querySession,
  updateSession,
  renameSession,
  // deleteTable,
  deleteDb,
};
