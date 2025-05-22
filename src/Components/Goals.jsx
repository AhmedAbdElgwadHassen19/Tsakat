import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
const UserGoalsPage = () => {
  const [goals, setGoals] = useState([]); // لتخزين الأهداف
  const [loading, setLoading] = useState(true); // لتتبع حالة التحميل
  const [fullName, setFullName] = useState(""); // لتخزين الاسم الكامل للمستخدم
  const navigate = useNavigate();

  useEffect(() => {
    // مراقبة حالة المستخدم باستخدام onAuthStateChanged
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // إذا لم يكن المستخدم مسجلاً دخوله، يتم توجيهه إلى صفحة تسجيل الدخول
        navigate("/login");
        return;
      }

      try {
        // جلب بيانات المستخدم من مجموعة users
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFullName(userData.fullName); // تعيين الاسم الكامل للمستخدم

          // الاستماع إلى التغييرات في مجموعة goals
          const q = query(
            collection(db, "goals"),
            where("userName", "==", userData.fullName) // البحث باستخدام fullName
          );
          const unsubscribeGoals = onSnapshot(q, (querySnapshot) => {
            const goalsData = [];
            querySnapshot.forEach((doc) => {
              goalsData.push({ id: doc.id, ...doc.data() });
            });
            setGoals(goalsData);
            setLoading(false);
          });

          // تنظيف الـ listener عند إلغاء التثبيت
          return () => unsubscribeGoals();
        } else {
          console.error("المستخدم غير موجود في قاعدة البيانات!");
        }
      } catch (error) {
        console.error("خطأ أثناء جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    });

    // تنظيف الـ listener عند إلغاء التثبيت
    return () => unsubscribeAuth();
  }, [navigate]);

  // دالة لتحديث حالة الهدف إلى "مكتمل"
  const handleCompleteGoal = async (goalId) => {
    try {
      // تحديث حالة الهدف في Firestore
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, {
        completed: true,
      });

      // تحديث حالة الهدف في الواجهة
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, completed: true } : goal
        )
      );

      alert("تم تحديث حالة الهدف إلى مكتمل!");
    } catch (error) {
      console.error("خطأ أثناء تحديث الهدف:", error);
      alert("حدث خطأ أثناء تحديث الهدف، يرجى المحاولة لاحقًا.");
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="container mt-5">
      <h2 className="text-center mb-4">الأهداف الخاصة بي</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      ) : goals.length > 0 ? (
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h5>أهداف {fullName}</h5> {/* عرض الاسم الكامل للمستخدم */}
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>الهدف</th>
                  <th>تاريخ الإضافة</th>
                  <th>الحالة</th> {/* عمود الحالة */}
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => (
                  <tr key={goal.id}>
                    <td>{goal.goal}</td>
                    <td>
                      {goal.createdAt ? goal.createdAt.toDate().toLocaleString() : "غير محدد"}
                    </td>
                    <td>
                      {goal.completed ? (
                        "مكتمل"
                      ) : (
                        <input
                          type="checkbox"
                          onChange={() => handleCompleteGoal(goal.id)}
                          disabled={goal.completed} // تعطيل المربع إذا كان الهدف مكتملًا
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center">لا توجد أهداف مضافة حتى الآن.</p>
      )}
    </div>
    </>
  );
};

export default UserGoalsPage;