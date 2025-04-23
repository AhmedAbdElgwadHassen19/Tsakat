import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig"; // استيراد Firestore
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const AdminGoalsPage = () => {
  const [goals, setGoals] = useState([]); // لتخزين الأهداف
  const [loading, setLoading] = useState(true); // لتتبع حالة التحميل

  useEffect(() => {
    // الاستماع إلى التغييرات في مجموعة goals
    const unsubscribe = onSnapshot(collection(db, "goals"), (querySnapshot) => {
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });
      setGoals(goalsData);
      setLoading(false);
    });

    // تنظيف الـ listener عند إلغاء التثبيت
    return () => unsubscribe();
  }, []);

  // دالة لحذف الهدف
  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteDoc(doc(db, "goals", goalId)); // حذف الهدف من Firestore
      alert("تم حذف الهدف بنجاح!");
    } catch (error) {
      console.error("خطأ أثناء حذف الهدف:", error);
      alert("حدث خطأ أثناء حذف الهدف، يرجى المحاولة لاحقًا.");
    }
  };

  // تجميع الأهداف حسب اسم المستخدم
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.userName]) {
      acc[goal.userName] = [];
    }
    acc[goal.userName].push(goal);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-evenly">
        <Link to={"/admin"}>
          <button className="btn btn-info">إضافة هدف جديد</button>
        </Link>
        <h2 className="text-center mb-4">جميع الأهداف</h2>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      ) : (
        Object.entries(groupedGoals).map(([userName, userGoals]) => (
          <div key={userName} className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white">
              <h5>{userName}</h5> {/* اسم المستخدم */}
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="col-5">الهدف</th> {/* عرض 50% */}
                      <th className="col-3">تاريخ الإضافة</th> {/* عرض 30% */}
                      <th className="col-2">الحالة</th> {/* عرض 20% */}
                      <th className="col-2">إجراء</th> {/* عرض 20% */}
                    </tr>
                  </thead>
                  <tbody>
                    {userGoals.map((goal) => (
                      <tr key={goal.id}>
                        <td className="col-5">{goal.goal}</td> {/* عرض 50% */}
                        <td className="col-3">
                          {goal.createdAt.toDate().toLocaleString()}
                        </td> {/* عرض 30% */}
                        <td className="col-2">
                          {goal.completed ? (
                            <span className="badge bg-success">مكتمل</span>
                          ) : (
                            <span className="badge bg-warning">قيد التنفيذ</span>
                          )}
                        </td> {/* عرض 20% */}
                        <td className="col-2">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteGoal(goal.id)} // استدعاء دالة الحذف
                          >
                            حذف
                          </button>
                        </td> {/* عرض 20% */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminGoalsPage;