import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Trash } from 'lucide-react';
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast, ToastContainer } from 'react-toastify'
import { FRONTEND_URL } from '../../constant';

export const BotTraining = (businessid) => {
  const [helpDeskQuestion, setHelpDeskQuestion] = useState('');
  const [helpDeskAnswer, setHelpDeskAnswer] = useState('');
  const [botTrainingQuestion, setBotTrainingQuestion] = useState('');
  const [helpDeskData, setHelpDeskData] = useState([]);
  const [botTrainingData, setBotTrainingData] = useState([]);

  useEffect(() => {
    const fetchHelpDeskData = async () => {
      try {
        const response = await fetch(`${FRONTEND_URL}/api/chatbot/gethelpdesk/${businessid.businessid}`);
        if (!response.ok) {
          toast.error('Failed to fetch help desk data');
          return;
        }
        const data = await response.json();
        setHelpDeskData(data);
      } catch (error) {
        console.log('Error fetching help desk data:', error);
      }
    };

    const fetchBotTrainingData = async () => {
      try {
        const response = await fetch(`${FRONTEND_URL}/api/chatbot/getFilterQuestion/${businessid.businessid}`);
        if (!response.ok) {
          toast.error('Failed to fetch bot training data');
          return;
        }
        const data = await response.json();
        setBotTrainingData(data);
      } catch (error) {
        console.log('Error fetching bot training data:', error);
      }
    };

    fetchHelpDeskData();
    fetchBotTrainingData();
  }, [businessid.businessid]);

  const handleHelpDeskSubmit = async () => {
    try {
      console.log(businessid);
      const response = await fetch(`${FRONTEND_URL}/api/chatbot/addhelpdesk/${businessid.businessid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ question: helpDeskQuestion, answer: helpDeskAnswer }),
      });
      if (response.ok) {
        toast.success('HelpDesk question added successfully');
      }
      const data = await response.json();
      console.log('Help desk question added successfully:', data);
     
      setHelpDeskQuestion('');
      setHelpDeskAnswer('');

      setHelpDeskData([...helpDeskData, data]);
    } catch (error) {
      toast.error('Failed to add help desk question');
      console.log('Error adding help desk question:', error);
    }
  };

  const handleBotTrainingSubmit = async () => {
    try {
      const response = await fetch(`${FRONTEND_URL}/api/chatbot/addfilterquestion/${businessid.businessid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ question: botTrainingQuestion }),
      });
      if (response.ok) {
        toast.success('Question added successfully');
      }
      const data = await response.json();
      console.log('Bot training question added successfully:', data);

      setBotTrainingQuestion('');
      setBotTrainingData([...botTrainingData, data]);
    } catch (error) {
      toast.error('Failed to add bot training question');
      console.log('Error adding bot training question:', error);
    }
  };

  const handleDelete = async (id,deleteQuestion) => {
    try {
      const response = await fetch(`${FRONTEND_URL}/api/chatbot/${deleteQuestion}/${businessid.businessid}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (response.ok) {
        toast.success("Question deleted successfully");
      }
      else{
        toast.error("Failed to delete question");
        return;
      }

      if(deleteQuestion === "deleteFilterQuestion")
        setBotTrainingData((prevData) => prevData.filter((item) => item._id !== id));
      else
        setHelpDeskData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Error deleting question:", error);
    }
  };
  
  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-2xl font-bold">Bot Training</h2>
        <p className="text-sm text-muted-foreground">
          Set FAQ questions, create questions for capturing lead information and train your bot to act the way you want
          it to.
        </p>
      </div>

      <Tabs defaultValue="help-desk" className="w-full">
        <TabsList>
          <TabsTrigger value="help-desk">Help Desk</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="help-desk">
          <Card className="grid md:grid-cols-2 h-[400px]">
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <h3 className="font-medium">Question</h3>
                <p className="text-sm text-muted-foreground">Add a question that you believe is frequently asked.</p>
                <Input
                  placeholder="Type your question"
                  value={helpDeskQuestion}
                  onChange={(e) => setHelpDeskQuestion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Answer to question</h3>
                <p className="text-sm text-muted-foreground">The answer for the question above.</p>
                <Textarea
                  placeholder="Type your answer"
                  className="min-h-[100px]"
                  value={helpDeskAnswer}
                  onChange={(e) => setHelpDeskAnswer(e.target.value)}
                />
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleHelpDeskSubmit}>
                Create
              </Button>
            </div>

          <div className="border-t p-6 md:border-l md:border-t-0 overflow-y-auto max-h-[400px] scrollbar-none">
  {helpDeskData.length === 0 ? (
    <p className="text-center text-sm text-muted-foreground">No questions to show</p>
  ) : (
    <ul className="space-y-4">
      {helpDeskData.map((item, index) => (
        <li
          key={index}
          className="relative p-4 border-l-4 border-indigo-500 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
        >
          <Button
            className="absolute top-2 right-2 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
            onClick={() => handleDelete(item._id, "deleteHelpDesk")}
          >
            <Trash className="w-4 h-4" />
          </Button>

          <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">{item.question}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
        </li>
      ))}
    </ul>
  )}
</div>


          </Card>
        </TabsContent>

        <TabsContent value="questions">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section: Bot Training Form */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Bot Training Question</h3>
                <p className="text-sm text-muted-foreground">Add a question for bot training.</p>
                <Input
                  placeholder="Type your question"
                  value={botTrainingQuestion}
                  onChange={(e) => setBotTrainingQuestion(e.target.value)}
                />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleBotTrainingSubmit}>
                Add Question
              </Button>
            </div>

            <div className="w-full md:w-1/2 border-l md:pl-6 overflow-y-auto max-h-[400px] scrollbar-none">
              {botTrainingData.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No questions to show</p>
              ) : (
                <ul className="space-y-4">
                  {botTrainingData.map((item) => (
                    <li
                      key={item._id}
                      className="relative p-4 border-l-4 border-indigo-500 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                    >
                      <Button
                        className="absolute top-2 right-2 bg-red-400 hover:bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleDelete(item._id, "deleteFilterQuestion")}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>

                      <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">{item.question}</h4>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </Card>

        </TabsContent>
      </Tabs>
    </div>
  )
}

