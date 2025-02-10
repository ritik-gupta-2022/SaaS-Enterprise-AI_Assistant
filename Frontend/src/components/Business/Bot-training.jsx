import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

export function BotTraining() {
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
          <Card className="grid md:grid-cols-2">
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <h3 className="font-medium">Question</h3>
                <p className="text-sm text-muted-foreground">Add a question that you believe is frequently asked.</p>
                <Input placeholder="Type your question" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Answer to question</h3>
                <p className="text-sm text-muted-foreground">The answer for the question above.</p>
                <Textarea placeholder="Type your answer" className="min-h-[100px]" />
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600">Create</Button>
            </div>

            <div className="border-t p-6 md:border-l md:border-t-0">
              <p className="text-center text-sm text-muted-foreground">No questions to show</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card className="p-6">
            <p className="text-center text-sm text-muted-foreground">No questions available</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

