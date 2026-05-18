from locust import HttpUser, task, between

class ScholarshipUser(HttpUser):
    wait_time = between(1, 3) # Simulate human waiting 1-3s between clicks

    @task
    def view_scholarships(self):
        # Simulate a user searching for Fully Funded scholarships
        self.client.get("/scholarships?tag=Fully Funded")

    @task
    def view_detail(self):
        # Simulate clicking a specific scholarship (ID 1)
        self.client.get("/scholarships/1")